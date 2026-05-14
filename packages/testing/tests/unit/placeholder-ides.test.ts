import { describe, it, expect } from 'vitest';
import * as eclipse from '@apps/eclipse/src/bootstrap/activateExtension';
import * as emacs from '@apps/emacs/src/bootstrap/activateExtension';
import * as fleet from '@apps/fleet/src/bootstrap/activateExtension';
import * as jetbrains from '@apps/jetbrains/src/bootstrap/activateExtension';
import * as neovim from '@apps/neovim/src/bootstrap/activateExtension';
import * as sublime from '@apps/sublime/src/bootstrap/activateExtension';
import * as vim from '@apps/vim/src/bootstrap/activateExtension';
import * as visualstudio from '@apps/visualstudio/src/bootstrap/activateExtension';
import * as zed from '@apps/zed/src/bootstrap/activateExtension';

describe('Placeholder IDEs activation', () => {
  it('should activate eclipse without throwing', () => {
    expect(() => eclipse.activateExtension()).not.toThrow();
  });
  it('should activate emacs without throwing', () => {
    expect(() => emacs.activateExtension()).not.toThrow();
  });
  it('should activate fleet without throwing', () => {
    expect(() => fleet.activateExtension()).not.toThrow();
  });
  it('should activate jetbrains without throwing', () => {
    expect(() => jetbrains.activateExtension()).not.toThrow();
  });
  it('should activate neovim without throwing', () => {
    expect(() => neovim.activateExtension()).not.toThrow();
  });
  it('should activate sublime without throwing', () => {
    expect(() => sublime.activateExtension()).not.toThrow();
  });
  it('should activate vim without throwing', () => {
    expect(() => vim.activateExtension()).not.toThrow();
  });
  it('should activate visualstudio without throwing', () => {
    expect(() => visualstudio.activateExtension()).not.toThrow();
  });
  it('should activate zed without throwing', () => {
    expect(() => zed.activateExtension()).not.toThrow();
  });
});
