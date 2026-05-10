import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import test from 'node:test';
import esbuild from 'esbuild';

await mkdir('.tmp-tests', { recursive: true });
await esbuild.build({
  entryPoints: ['src/domain/ast/index.ts'],
  bundle: true,
  outfile: '.tmp-tests/astBuilder.mjs',
  platform: 'node',
  format: 'esm'
});

const { RegexSourceAstBuilder, countAstNodes, getImportSources, findAstNodes } = await import('../.tmp-tests/astBuilder.mjs');

function buildAst(content, path = 'src/domain/reviewService.ts') {
  return new RegexSourceAstBuilder().build({ path, content });
}

test('given TypeScript source when building AST then maps structural nodes used by architecture rules', () => {
  const ast = buildAst(`
    import { A } from './a';
    export class ReviewService extends BaseService {
      updateStatus(status) {
        if (status === 'OPEN') return fetch('/api');
        throw new Error('unsupported');
      }
    }
  `);

  assert.deepEqual(getImportSources(ast), ['./a']);
  assert.equal(countAstNodes(ast, 'ClassDeclaration'), 1);
  assert.equal(countAstNodes(ast, 'MethodDeclaration'), 1);
  assert.equal(countAstNodes(ast, 'ConditionalStatement'), 1);
  assert.equal(countAstNodes(ast, 'ThrowStatement'), 1);
  assert.equal(countAstNodes(ast, 'ExternalCall'), 1);
  assert.equal(findAstNodes(ast, (node) => node.kind === 'ClassDeclaration')[0].metadata.extends, 'BaseService');
});

test('given comments and string literals when building AST then ignores fake code inside them', () => {
  const ast = buildAst(`
    // import { Fake } from '../infrastructure/fake';
    const text = "class FakeService { fail() { throw new Error('unsupported') } fetch('/api') }";
    /*
      interface CommentedContract { sync(): void }
      if (status === 'OPEN') fetch('/api')
    */
    export class RealService {
      execute() { return true; }
    }
  `);

  assert.deepEqual(getImportSources(ast), []);
  assert.equal(countAstNodes(ast, 'ClassDeclaration'), 1);
  assert.equal(countAstNodes(ast, 'InterfaceDeclaration'), 0);
  assert.equal(countAstNodes(ast, 'ThrowStatement'), 0);
  assert.equal(countAstNodes(ast, 'ExternalCall'), 0);
  assert.equal(countAstNodes(ast, 'ConditionalStatement'), 0);
});

test('given declarations with bodies when building AST then nests methods under the active declaration scope', () => {
  const ast = buildAst(`
    export interface ReviewContract {
      approve(): void;
    }

    export class ReviewService {
      approve() {
        if (status === 'APPROVED') return;
      }
    }
  `);

  const contract = findAstNodes(ast, (node) => node.kind === 'InterfaceDeclaration' && node.name === 'ReviewContract')[0];
  const service = findAstNodes(ast, (node) => node.kind === 'ClassDeclaration' && node.name === 'ReviewService')[0];

  assert.equal(contract.children.filter((node) => node.kind === 'MethodDeclaration').length, 1);
  assert.equal(service.children.filter((node) => node.kind === 'MethodDeclaration').length, 1);
  assert.equal(service.children.filter((node) => node.kind === 'ConditionalStatement').length, 1);
});
