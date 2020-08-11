import { Pipe, PipeTransform } from '@angular/core';

import { PricingMatchTypes } from 'libs/features/pricing-match/constants';

@Pipe({
  name: 'pricingMatchType',
  pure: true
})

export class PricingMatchTypePipe implements PipeTransform {
  transform(pricingMatch: any) {
    switch (true) {
      case pricingMatch['CompanyJobs_PricingsMatches_MDJob_Code'] != null:
        return PricingMatchTypes.MD_JOB;
      case pricingMatch['CompanyJobs_PricingsMatches_Slotted_CompanyJob_ID'] != null:
        return PricingMatchTypes.SLOTTED_COMPANY_JOB;
      case pricingMatch['ExchangeDataCut_FilterGUID'] != null:
        return PricingMatchTypes.PEER;
      default:
        return PricingMatchTypes.SURVEY;
    }
  }
}
