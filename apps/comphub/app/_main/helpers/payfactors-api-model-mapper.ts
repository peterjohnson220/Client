import { GridDataResult } from '@progress/kendo-angular-grid';

import { QuickPriceResponse, TrendingJobGroupResponse } from 'libs/models/payfactors-api/comphub';

import { PayMarket } from 'libs/models/paymarket';

import { TrendingJobGroup, PricingPaymarket } from '../models';

export class PayfactorsApiModelMapper {

  static mapTrendingJobGroupsResponseToTrendingJobGroups(response: TrendingJobGroupResponse[]): TrendingJobGroup[] {
    return response.map(tjg => {
      return {
        Name: `Hot Jobs - ${tjg.GroupName === 'Industry' ? 'Your' : ''} ${tjg.GroupName}`,
        Jobs: tjg.TrendingJobs
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

  static mapPriceDataToGridDataResult(response: QuickPriceResponse): GridDataResult {
    return {
      total: response.Count,
      data: response.Data
    };
  }
}
