import {
  CountryDataSetResponse,
  JobSalaryTrendResponse,
  QuickPriceMarketData,
  QuickPriceResponse,
  TrendingJobGroupResponse
} from 'libs/models/payfactors-api/comphub';

import { PayMarket } from 'libs/models/paymarket';

import { TrendingJobGroup, PricingPaymarket, KendoDropDownItem, MarketDataScope,
  JobData, JobGridData, CountryDataSet, JobSalaryTrend } from '../models';
import { MDScopeResponse } from 'libs/models/payfactors-api';
import { MDScopeSizeCategory } from 'libs/constants';
import { countryFlagMap } from '../data';

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
      Sizes: this.mapScopeValuesToKendoDropDownItems(response.Sizes[MDScopeSizeCategory.Employees]),
      Industries: this.mapScopeValuesToKendoDropDownItems(response.Industries)
    };
  }

  static mapScopeValuesToKendoDropDownItems(scopeValues: string[]): KendoDropDownItem[] {
    if (!scopeValues) {
      return [];
    }
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
        JobCode: q.JobCode,
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
        Orgs: q.Orgs,
        ShowJd: false
      };
    });
  }

  static mapJobSalaryTrendToTrendData(jobSalaryTrendResponse: JobSalaryTrendResponse): JobSalaryTrend {
    return {
      PercentageChange: jobSalaryTrendResponse.PercentageChange,
      Data: jobSalaryTrendResponse.Data.map(s => {
        return {
          EffectiveDate: s.EffectiveDate,
          SalaryAnnual: Math.round(s.AverageSalaryAnnual),
          SalaryHourly: s.AverageSalaryHourly
        };
      })
    };
  }

  static mapCountryDataSetResponseToCountryDataSets(countryDataSetResponse: CountryDataSetResponse[]): CountryDataSet[] {
    return countryDataSetResponse.map(cdr => {
        return {
          CountryCode: cdr.CountryCode,
          CountryName: cdr.CountryName,
          CurrencyCode: cdr.CurrencyCode,
          GeoLabel: cdr.GeoLabel,
          Active: cdr.Active,
          FlagCode: countryFlagMap[cdr.CountryCode]
        };
      });
  }
}
