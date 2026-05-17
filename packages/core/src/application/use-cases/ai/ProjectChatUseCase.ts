import { AIProviderPort } from '../../../ports/ai/AIProviderPort';
import { RagContextBuilderPort } from '../../../ports/rag/RagContextBuilderPort';
import { DependencyGraphPort } from '../../../ports/ast/DependencyGraphPort';
import { IdeWorkspacePort } from '../../../ports/ide/IdeWorkspacePort';
import { IdeFileSystemPort } from '../../../ports/ide/IdeFileSystemPort';
import { AIChatMessageDTO } from '../../dto/ai/AIChatDTO';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  answer: string;
  relevantFiles: string[];
}

export class ProjectChatUseCase {
  constructor(
    private readonly aiProvider: AIProviderPort,
    private readonly contextBuilder: RagContextBuilderPort,
    private readonly workspace: IdeWorkspacePort,
    private readonly fileSystem: IdeFileSystemPort,
    private readonly graphBuilder?: DependencyGraphPort
  ) {}

  async execute(query: string, history: ChatMessage[] = []): Promise<ChatResponse> {
    console.log(`[CHAT] Processing query: ${query}`);

    // 1. Get code context via RAG
    const chunks = await this.contextBuilder.buildContext(query);
    const codeContext = chunks.map(c => `FILE: ${c.source}\n${c.content}`).join('\n\n');
    const relevantFiles = Array.from(new Set(chunks.map(c => c.source)));

    // 2. Build the full prompt
    const systemPrompt = `
You are an expert software architect and developer assistant. 
You have access to the project's code snippets and structure via RAG.
Answer the user's question accurately based on the provided context.
If you don't know the answer, say so. Do not hallucinate.

CONTEXT FROM CODEBASE:
${codeContext}

INSTRUCTIONS:
- Be concise and technical.
- Use Markdown for code blocks.
- If the user asks about architecture, refer to the provided files.
`;

    // 3. Prepare messages for Chat
    const messages: AIChatMessageDTO[] = [
        { role: 'system', content: systemPrompt },
        ...history.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: query }
    ];

    // 4. Call AI Chat
    const response = await this.aiProvider.chat({
        messages,
        context: codeContext // Providing context separately too if the provider supports it
    });

    return {
      answer: response.answer,
      relevantFiles
    };
  }
}
