import { JobSearchResult } from 'libs/models/payfactors-api';

import { PayMarket } from 'libs/models/paymarket';

import { JobResult, JobPayMarket } from '../models';


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
        IsSelected: false
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

}
