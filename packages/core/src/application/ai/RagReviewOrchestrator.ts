import { SearchContextService } from '../rag/SearchContextService';
import { RagContextBuilder } from './RagContextBuilder';
import { RagPromptBuilder } from './RagPromptBuilder';

export class RagReviewOrchestrator {

    constructor(
        private readonly search:
            SearchContextService,

        private readonly contextBuilder:
            RagContextBuilder,

        private readonly promptBuilder:
            RagPromptBuilder
    ) { }

    async buildPrompt(
        diff: string
    ): Promise<string> {

        const chunks =
            await this.search
                .search(diff);

        const context =
            this.contextBuilder
                .build(chunks);

        return this.promptBuilder
            .build(
                diff,
                context
            );
    }
}