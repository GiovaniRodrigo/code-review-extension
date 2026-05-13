export type ReviewProcessingState =
    | 'idle'
    | 'loading'
    | 'collecting-commits'
    | 'generating-diffs'
    | 'analyzing'
    | 'building-findings'
    | 'completed'
    | 'error';