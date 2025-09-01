import axios from 'axios';
import type { SummaryMetrics } from './models/SummaryMetrics';
import type { Filters } from './models/Filters';
import type { GroupedMetricsResponse } from './models/GroupedMetricsResponse';

class UsageMetricsWebservice {
  private summaryUrl = 'http://localhost:9000/metrics/summary';
  private groupedUrl = 'http://localhost:9000/metrics/grouped';

  public async getSummaryMetrics(filters: Filters): Promise<SummaryMetrics> {
    const params: any = {
      ...filters,
    };

    const response = await axios.get<SummaryMetrics>(`${this.summaryUrl}`, { params });
    return response.data;
  }

  public async getGroupedMetrics(groupBy: string, period: 'day' | 'week' | 'month'): Promise<GroupedMetricsResponse> {
    const params = { groupBy, period };
    const response = await axios.get<GroupedMetricsResponse>(this.groupedUrl, { params });
    return response.data;
  }
}

export const usageMetricsWebservice = new UsageMetricsWebservice();