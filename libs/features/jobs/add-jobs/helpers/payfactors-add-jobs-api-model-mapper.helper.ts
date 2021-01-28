import { JobSearchResult, CreateNewProjectJobRequest, JobBasedRangeJobSearchResult } from 'libs/models/payfactors-api';
import { PayMarket } from 'libs/models/paymarket';

import { JobPayMarket, JobResult } from '../models';

export class PayfactorsAddJobsApiModelMapper {

  ///
  /// IN
  ///
  static mapJobSearchResultsToJobResults(jobSearchResults: JobSearchResult[]): JobResult[] {
    return jobSearchResults.map(jsr => {
      return {
        Id: jsr.Id,
        Title: jsr.Title,
        Code: jsr.Code,
        Source: jsr.CompanyName,
        BaseMRP: jsr.Base50Mrp,
        TCCMRP: jsr.TccMrp,
        IsMappedToPeerExchange: jsr.IsMappedInPeerExchange,
        Family: jsr.Family,
        Description: jsr.Description,
        FLSAStatus: jsr.FLSAStatus,
        Category: jsr.Category,
        Level: jsr.Level,
        EEO: jsr.EEO,
        UdfFields: jsr.UdfFields,
        IsSelected: false,
        IsPayfactorsJob: jsr.IsPayfactorsJob,
        PricingDataLoading: false,
        PricingDataLoaded: false,
        ShowJobDetail: false
      };
    });
  }

  static mapJobBasedRangeJobSearchResultsToJobResults(jobSearchResults: JobBasedRangeJobSearchResult[]): JobResult[] {
    return jobSearchResults.map(jsr => {
      return {
        Id: jsr.Id,
        Title: jsr.Title,
        Code: jsr.Code,
        Source: jsr.CompanyName,
        BaseMRP: jsr.Base50Mrp,
        TCCMRP: jsr.TccMrp,
        IsMappedToPeerExchange: jsr.IsMappedInPeerExchange,
        Family: jsr.Family,
        Description: jsr.Description,
        FLSAStatus: jsr.FLSAStatus,
        Category: jsr.Category,
        Level: jsr.Level,
        EEO: jsr.EEO,
        UdfFields: jsr.UdfFields,
        IsSelected: false,
        IsPayfactorsJob: jsr.IsPayfactorsJob,
        PricingDataLoading: false,
        PricingDataLoaded: false,
        ShowJobDetail: false,
        AssignedStructures: jsr.CompanyStructures
      };
    });
  }

  static mapPaymarketsToJobPayMarkets(paymarkets: PayMarket[]): JobPayMarket[] {
    return paymarkets.map(pm => {
      return {
        CompanyPayMarketId: pm.CompanyPayMarketId,
        PayMarket: pm.PayMarket,
        IsHidden: false,
        IsSelected: false
      };
    });
  }

  ///
  /// OUT
  ///
  static buildCreateNewProjectJobRequest(createNewJobForm: any, companyPayMarketIds: number[]): CreateNewProjectJobRequest {
    return {
      JobCode: createNewJobForm.jobCode || '',
      JobTitle: createNewJobForm.jobTitle || '',
      JobLevel: createNewJobForm.jobLevel || '',
      JobFamily: createNewJobForm.jobFamily || '',
      JobDescription: createNewJobForm.jobDescription || '',
      CompanyPayMarketIds: companyPayMarketIds
    };
  }
}
