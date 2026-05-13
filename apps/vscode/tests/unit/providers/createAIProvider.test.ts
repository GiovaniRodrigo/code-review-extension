import { beforeEach, describe, expect, it, vi } from "vitest";
import * as vscode from "vscode";
import { MockAIProvider, OllamaProvider, OpenAIProvider } from "@code-review/infra";
import { createAIProvider } from "../../../src/providers/createAIProvider";

describe("createAIProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("cria MockAIProvider por padrão", async () => {
    const provider = await createAIProvider({
      secrets: { get: vi.fn(), store: vi.fn() }
    } as any);

    expect(provider).toBeInstanceOf(MockAIProvider);
  });

  it("cria OllamaProvider usando configurações do workspace", async () => {
    vi.mocked(vscode.workspace.getConfiguration).mockReturnValueOnce({
      get: vi.fn((key: string, defaultValue?: unknown) => {
        const values: Record<string, unknown> = {
          provider: "ollama",
          "ollama.baseUrl": "http://localhost:11434",
          "ollama.model": "deepseek-coder:latest"
        };

        return values[key] ?? defaultValue;
      })
    } as any);

    const provider = await createAIProvider({
      secrets: { get: vi.fn(), store: vi.fn() }
    } as any);

    expect(provider).toBeInstanceOf(OllamaProvider);
  });
});