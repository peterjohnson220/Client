import { GridDataResult } from '@progress/kendo-angular-grid';

import { QuickPriceResponse, TrendingJobGroupResponse } from 'libs/models/payfactors-api/comphub';

import { PayMarket } from 'libs/models/paymarket';

import { TrendingJobGroup, PricingPaymarket, KendoDropDownItem, MarketDataScope } from '../models';
import { MDScopeResponse } from 'libs/models/payfactors-api';
import { MDScopeSizeCategory, MDScopeGeoGroup } from 'libs/constants';

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

  static mapPriceDataToGridDataResult(response: QuickPriceResponse): GridDataResult {
    return {
      total: response.Count,
      data: response.Data
    };
  }

  static mapMDScopeResponseToMarketDataScope(response: MDScopeResponse): MarketDataScope {
    return {
      Locations: this.mapScopeValuesToKendoDropDownItems(response.Locations[MDScopeGeoGroup.CityState]),
      Sizes: this.mapScopeValuesToKendoDropDownItems(response.Sizes[MDScopeSizeCategory.Employees]),
      Industries: this.mapScopeValuesToKendoDropDownItems(response.Industries)
    };
  }

  static mapScopeValuesToKendoDropDownItems(scopeValues: string[]): KendoDropDownItem[] {
    return scopeValues.map(s => {
      return {
        Name: s,
        Value: s
      };
    });
  }
}
