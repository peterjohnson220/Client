import { TrendingJobGroupResponse } from 'libs/models/payfactors-api/comphub';

import { TrendingJobGroup } from '../models';

export class PayfactorsApiModelMapper {

  static mapTrendingJobGroupsResponseToTrendingJobGroups(response: TrendingJobGroupResponse[]): TrendingJobGroup[] {
    return response.map(tjg => {
      return {
        Name: `Hot Jobs - ${tjg.GroupName === 'Industry' ? 'Your' : ''} ${tjg.GroupName}`,
        Jobs: tjg.TrendingJobs
      };
    });
  }
}
