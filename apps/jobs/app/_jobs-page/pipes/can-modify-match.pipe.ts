import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'canModifyMatch',
  pure: true
})

export class CanModifyMatch implements PipeTransform {
  transform(dataRow: any, pricingInfo: any, canModifyPricings: boolean, hasPeerPermission: boolean) {
    return canModifyPricings
      && !pricingInfo['CompanyPayMarkets_Linked_PayMarket_Name']
      && (
        dataRow['CompanyJobs_PricingsMatches_Survey_Data_ID'] ||
        (dataRow['ExchangeDataCut_FilterGUID'] && hasPeerPermission)
      );
  }
}
