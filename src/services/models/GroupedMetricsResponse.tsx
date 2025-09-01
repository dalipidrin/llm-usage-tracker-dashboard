import type { PeriodValue } from "./PeriodValue";

export interface GroupedMetricsResponse {
  data: Record<string, PeriodValue[]>;
}