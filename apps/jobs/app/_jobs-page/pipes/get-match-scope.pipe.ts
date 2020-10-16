import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getMatchScope',
  pure: true
})

export class GetMatchScope implements PipeTransform {
  transform(dataRow: any) {
    return `${dataRow.vw_PricingMatchesJobTitlesMerged_Scope1 ? ' - ' + dataRow.vw_PricingMatchesJobTitlesMerged_Scope1 : ''}
    ${dataRow.vw_PricingMatchesJobTitlesMerged_Scope2 ? ' - ' + dataRow.vw_PricingMatchesJobTitlesMerged_Scope2 : ''}
    ${dataRow.vw_PricingMatchesJobTitlesMerged_Scope3 ? ' - ' + dataRow.vw_PricingMatchesJobTitlesMerged_Scope3 : ''}`;
  }
}
