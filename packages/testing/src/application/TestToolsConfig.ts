import { z } from 'zod';

export const TestToolsConfigSchema = z.object({
  coverage: z.object({
    domain: z.number().min(0).max(100).default(95),
    application: z.number().min(0).max(100).default(90),
    infra: z.number().min(0).max(100).default(80)
  }),
  commands: z.object({
    vitest: z.string().default('vitest'),
    eslint: z.string().default('eslint'),
    dependencyCruiser: z.string().default('depcruise'),
    madge: z.string().default('madge')
  })
});

export type TestToolsConfig = z.infer<typeof TestToolsConfigSchema>;

export function parseTestToolsConfig(input: unknown): TestToolsConfig {
  return TestToolsConfigSchema.parse(input);
}
