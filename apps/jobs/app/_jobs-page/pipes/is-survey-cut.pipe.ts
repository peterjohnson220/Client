import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isSurveyCut',
  pure: true
})

export class IsSurveyCut implements PipeTransform {
  transform(dataRow: any, pricingInfo: any, canModifyPricings: boolean) {
    return dataRow['CompanyJobs_PricingsMatches_Survey_Data_ID']
      && !pricingInfo['CompanyPayMarkets_Linked_PayMarket_Name']
      && canModifyPricings;
  }
}
