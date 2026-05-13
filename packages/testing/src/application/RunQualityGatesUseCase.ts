import { QualityGate, QualityGateReport } from '../domain/QualityGate';
import { TestToolPort } from '../ports/TestToolPort';

export class RunQualityGatesUseCase {
  constructor(
    private readonly tools: TestToolPort[],
    private readonly qualityGate = new QualityGate()
  ) {}

  async execute(): Promise<QualityGateReport> {
    const results = [];

    for (const tool of this.tools) {
      results.push(await tool.run());
    }

    return this.qualityGate.evaluate(results);
  }
}
