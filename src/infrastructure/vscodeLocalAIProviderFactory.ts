import * as vscode from 'vscode';
import { AIProvider } from '../contracts';
import { LocalDeterministicAIProvider } from '../ai/providers/LocalDeterministicAIProvider';
import { OllamaAIProvider } from '../ai/providers/OllamaAIProvider';

export function createLocalAIProviderFromVSCodeSettings(): AIProvider {
  const provider = readSetting('ai.provider', '');
  const normalizedProvider = provider.trim().toLowerCase();

  if (normalizedProvider === 'ollama') {
    const baseUrl = readSetting('ai.ollamaUrl', 'http://localhost:11434');
    const model = readSetting('ai.model', '');

    if (model.trim()) {
      return new OllamaAIProvider({ baseUrl, model });
    }
  }

  return new LocalDeterministicAIProvider();
}

function readSetting(key: string, fallback: string): string {
  const current = vscode.workspace.getConfiguration('giovaniCodeReview').get<string>(key);
  if (typeof current === 'string' && current.trim()) return current;

  // Backward compatibility: users who already configured the earlier namespace
  // should not see "IA local não configurada" after upgrading.
  const legacy = vscode.workspace.getConfiguration('codeReview').get<string>(key);
  if (typeof legacy === 'string' && legacy.trim()) return legacy;

  return fallback;
}
