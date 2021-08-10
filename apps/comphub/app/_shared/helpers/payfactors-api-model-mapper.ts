import {
  CountryDataSetResponse,
  JobSalaryTrendResponse,
  QuickPriceMarketData,
  QuickPriceListResponse,
  TrendingJobGroupResponse,
  GetCrowdSourcedJobPricingResponse
} from 'libs/models/payfactors-api/comphub';
import { PayMarket } from 'libs/models/paymarket';
import { KendoDropDownItem } from 'libs/models/kendo';
import { MDLocationResponse, MDScopeResponse } from 'libs/models/payfactors-api';
import { Filter } from 'libs/features/search/search/models';
import { MDScopeSizeCategory } from 'libs/constants';
import { SearchCrowdSourcedJobsResponse } from 'libs/models/payfactors-api/comphub/response/search-crowd-sourced-jobs-response.model';
import { JobData, JobGridData, PricingPaymarket } from 'libs/models/comphub';
import { GenericKeyValue } from 'libs/models/common';

import { CountryDataSet, JobSalaryTrend, MarketDataLocation, MarketDataScope, TrendingJobGroup } from '../models';

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
        SizeLabel: pm.SizeLabel,
        CurrencyCode: pm.CurrencyCode,
        CountryCode: pm.CountryCode
      };
    });
  }

  static mapPaymarketToPricingPayMarket(payMarket: PayMarket): PricingPaymarket {
    return {
      CompanyPayMarketId: payMarket.CompanyPayMarketId,
      PayMarketName: payMarket.PayMarket,
      Industry: payMarket.IndustryValue,
      Location: payMarket.GeoValue,
      Size: payMarket.SizeValue,
      SizeLabel: payMarket.SizeLabel,
      CurrencyCode: payMarket.CurrencyCode,
      CountryCode: payMarket.CountryCode
    };
  }

  static mapPriceDataToGridDataResult(response: QuickPriceListResponse): JobGridData {
    return {
      Total: response.Count,
      Data: response.Data.map(x => this.mapQuickPriceMarketDataToJobData(x))
    };
  }

  static mapMDScopeResponseToMarketDataScope(response: MDScopeResponse): MarketDataScope {
    return {
      Sizes: this.mapScopeValuesToKendoDropDownItems(response.Sizes[MDScopeSizeCategory.Employees]),
      Industries: this.mapScopeValuesToKendoDropDownItems(response.Industries),
      OrganizationTypes: this.mapOrganizationTypesResponseToKendoDropDownItems(response.OrganizationTypes)
    };
  }

  static mapEducationTypeValuesToArray(response: GenericKeyValue<number, string>[]): string[] {
    return response.map(et => et['Name']);
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

  static mapOrganizationTypesResponseToKendoDropDownItems(response: GenericKeyValue<number, string>[]): KendoDropDownItem[] {
    return response.map(ot => {
      return {
        Name: ot['Name'],
        Value: ot['OrganizationTypeId']
      };
    });
  }

  static mapQuickPriceMarketDataToJobData(q: QuickPriceMarketData): JobData {
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
      ShowJd: false,
      ExchangeName: q.ExchangeName,
      EffectiveDate: q.EffectiveDate
    };
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
        FlagCode: cdr.CountryCode
      };
    });
  }

  static mapMdLocationsResponseToMarketDataLocations(response: MDLocationResponse[]): MarketDataLocation[] {
    return response.map(md => {
      return {
        LocationName: md.LocationName,
        GeoLabel: md.GeoLabel,
        GeoLabelDisplayName: md.GeoLabelDisplayName
      };
    });
  }

  static mapSelectedFilters(filters: any): Filter[] {
    const mappedFilters = filters;
    mappedFilters.forEach(filter => {
      filter.Options.forEach(options => {
        options.Selected = true;
      });
    });
    return mappedFilters;
  }

  static mapSearchCrowdSourcedJobsResponseToJobGridData(response: SearchCrowdSourcedJobsResponse): JobGridData {
    const data = response.Jobs.map(csjd => {
      return {
        JobTitle: csjd.JobTitle,
        Tasks: csjd.Tasks,
        JobId: null,
        JobCode: null,
        JobDescription: null,
        Education: null,
        YearsOfExperience: null,
        ManagesEmployees: null,
        Skills: null,
        FLSAStatus: null,
        ShowJd: null
      };
    });

    return {
      Total: response.Total,
      Data: data
    };
  }

  static mapGetCrowdSourcedJobPricingResponseToJobData(response: GetCrowdSourcedJobPricingResponse): JobData {
    return {
      JobTitle: response.JobTitle,
      Base10: response.Base10th,
      Base25: response.Base25th,
      Base50: response.Base50th,
      Base75: response.Base75th,
      Base90: response.Base90th,
      BaseAvg: response.BaseAvg,
      Tcc10: response.Total10th,
      Tcc25: response.Total25th,
      Tcc50: response.Total50th,
      Tcc75: response.Total75th,
      Tcc90: response.Total90th,
      TccAvg: response.TotalAvg,
      JobId: null,
      JobCode: null,
      JobDescription: null,
      Education: null,
      YearsOfExperience: null,
      ManagesEmployees: null,
      Skills: null,
      FLSAStatus: null,
      ShowJd: null
    };
  }
}
