import { TrendingJobGroupResponse } from 'libs/models/payfactors-api/comphub';

import { TrendingJobGroup } from '../models/trending-job.model';

export class PayfactorsApiModelMapper {

  static mapTrendingJobGroupsResponseToTrendingJobGroups(response: TrendingJobGroupResponse[]): TrendingJobGroup[] {
    return response.map(tjg => {
      return {
        Name: `Hot Jobs - ${tjg.GroupName === 'Industry' ? 'Your' : ''} ${tjg.GroupName}`,
        Jobs: tjg.TrendingJobs.map(j => {
          return {
            Name: j.Name,
            Count: j.Count
          };
        })
      };
    });
  }
}
