import { TrendingJobResponse } from 'libs/models/payfactors-api/comphub';

import { TrendingJob } from '../models/trending-job.model';

export class PayfactorsApiModelMapper {

  static mapTrendingJobsResponseToTrendingJobs(response: TrendingJobResponse[]): TrendingJob[] {
    return response.map(tjr => {
      return {
        Name: tjr.Name,
        Count: tjr.Count
      };
    });
  }
}
