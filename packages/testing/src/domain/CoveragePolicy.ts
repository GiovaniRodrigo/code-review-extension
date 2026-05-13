export interface CoverageThresholds {
  domain: number;
  application: number;
  infra: number;
}

export const DEFAULT_COVERAGE_THRESHOLDS: CoverageThresholds = {
  domain: 95,
  application: 90,
  infra: 80
};
