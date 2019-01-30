import { TrendingJobGroupResponse } from 'libs/models/payfactors-api/comphub';

import { PayMarket } from 'libs/models/paymarket';

import { TrendingJobGroup, PricingPaymarket } from '../models';

export class PayfactorsApiModelMapper {

  static mapTrendingJobGroupsResponseToTrendingJobGroups(response: TrendingJobGroupResponse[]): TrendingJobGroup[] {
    return response.map(tjg => {
      return {
        Name: tjg.GroupName,
        Jobs: tjg.TrendingJobs,
        Order: tjg.GroupName === 'Overall' ? 1 : 2
      };
    });
  }

  static mapPaymarketsToPricingPayMarkets(paymarkets: PayMarket[]): PricingPaymarket[] {
    return paymarkets.map(pm => {
      return {
        CompanyPayMarketId: pm.CompanyPayMarketId,
        PayMarketName: pm.PayMarket,
        Industry: pm.IndustryValue,
        Location: pm.GeoValue,
        Size: pm.SizeValue
      };
    });
  }
}
