import { QuickPriceMarketData, QuickPriceResponse, TrendingJobGroupResponse } from 'libs/models/payfactors-api/comphub';

import { PayMarket } from 'libs/models/paymarket';

import { TrendingJobGroup, PricingPaymarket, KendoDropDownItem, MarketDataScope, JobData, JobGridData } from '../models';
import { MDScopeResponse } from 'libs/models/payfactors-api';
import { MDScopeSizeCategory, MDScopeGeoGroup } from 'libs/constants';

export class PayfactorsApiModelMapper {

  static mapTrendingJobGroupsResponseToTrendingJobGroups(response: TrendingJobGroupResponse[]): TrendingJobGroup[] {
    return response.map(tjg => {
      return {
        Name: tjg.GroupName,
        Group: tjg.GroupType,
        Jobs: tjg.TrendingJobs,
        Order: tjg.GroupType === 'Overall' ? 1 : 2
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
        Size: pm.SizeValue,
        SizeLabel: pm.SizeLabel
      };
    });
  }

  static mapPriceDataToGridDataResult(response: QuickPriceResponse): JobGridData {
    return {
      Total: response.Count,
      Data: this.mapQuickPriceMarketDataToJobData(response.Data)
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

  static mapQuickPriceMarketDataToJobData(qpmd: QuickPriceMarketData[]): JobData[] {
    return qpmd.map(q => {
      return {
        JobId: q.JobId,
        JobTitle: q.JobTitle,
        JobDescription: q.JobDescription,
        Education: q.Education,
        FLSAStatus: q.FLSAStatus,
        YearsOfExperience: q.YearsOfExperience,
        ManagesEmployees: q.ManagesEmployees,
        Skills: q.Skills,
        Base25: q.Base25,
        Base50: q.Base50,
        Base75: q.Base75,
        Tcc25: q.Tcc25,
        Tcc50: q.Tcc50,
        Tcc75: q.Tcc75,
        Incs: q.Incs,
        Orgs: q.Orgs
      };
    });
  }
}
