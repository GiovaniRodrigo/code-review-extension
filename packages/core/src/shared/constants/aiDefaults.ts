export const AI_DEFAULTS = {
  defaultMode: 'fast',
  maxContextChunks: 5,
  maxCodeLines: 120,
  temperature: 0.1,
  requireJson: true,
  allowMarkdown: false,
  useRagByDefault: false,
  useAstSummary: true,
  fallbackOnInvalidJson: true
} as const;
