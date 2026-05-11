import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const ollamaProvider = readFileSync('src/ai/providers/OllamaAIProvider.ts', 'utf8');
const aiReviewService = readFileSync('src/application/AIReviewCommentService.ts', 'utf8');
const commentItem = readFileSync('webview-ui/src/components/molecules/CommentItem.jsx', 'utf8');

test('ollama prompt orchestration limits context and output for local models', () => {
  assert.match(ollamaProvider, /MAX_FILES = 3/);
  assert.match(ollamaProvider, /MAX_CONTEXT_CHARS = 5200/);
  assert.match(ollamaProvider, /MAX_COMMENT_CHARS = 180/);
  assert.match(ollamaProvider, /num_predict: 320/);
  assert.match(ollamaProvider, /timeoutMs: 20000/);
  assert.match(ollamaProvider, /temperature: 0\.1/);
});

test('ollama provider requires structured short JSON comments', () => {
  assert.match(ollamaProvider, /Retorne somente JSON válido/);
  assert.match(ollamaProvider, /Cada body deve ter no máximo/);
  assert.match(ollamaProvider, /\{"comments":\[/);
  assert.match(ollamaProvider, /limitSentence/);
});

test('ai review service stores concise AI comments and reduced snippets', () => {
  assert.match(aiReviewService, /slice\(0, 3\)/);
  assert.match(aiReviewService, /extractRelevantSnippet/);
  assert.match(aiReviewService, /Ação: validar, editar ou descartar/);
});

test('comment UI visually separates AI suggestions from manual comments', () => {
  assert.match(commentItem, /ai-comment/);
  assert.match(commentItem, /sugestão IA/);
  assert.match(commentItem, /cleanAICommentBody/);
  assert.match(commentItem, /Bot/);
});
