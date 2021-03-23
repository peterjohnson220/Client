import { Pipe, PipeTransform } from '@angular/core';

import { DataCutSummaryTypes } from 'libs/features/pricings/data-cut-summary/constants';

@Pipe({
  name: 'pricingMatchType',
  pure: true
})

export class PricingMatchTypePipe implements PipeTransform {
  transform(pricingMatch: any) {
    switch (true) {
      case pricingMatch['CompanyJobs_PricingsMatches_MDJob_Code'] != null:
        return DataCutSummaryTypes.MD_JOB;
      case pricingMatch['CompanyJobs_PricingsMatches_Slotted_CompanyJob_ID'] != null:
        return DataCutSummaryTypes.SLOTTED_COMPANY_JOB;
      case pricingMatch['ExchangeDataCut_FilterGUID'] != null:
        return DataCutSummaryTypes.PEER;
      default:
        return DataCutSummaryTypes.SURVEY;
    }
  }
}
