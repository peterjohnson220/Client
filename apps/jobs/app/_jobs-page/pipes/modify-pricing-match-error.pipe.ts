import { Pipe, PipeTransform } from '@angular/core';
import { PermissionService } from 'libs/core';
import { PermissionCheckEnum, Permissions } from 'libs/constants';

@Pipe({
  name: 'modifyPricingMatchError',
  pure: true
})

export class ModifyPricingMatchError implements PipeTransform {

  constructor(private permissionService: PermissionService) { }

  transform(pricingInfo: any, isActiveJob: boolean = true, pricingMatchCount: number = 2) {

    if (!this.permissionService.CheckPermission([Permissions.MODIFY_PRICINGS], PermissionCheckEnum.Single)) {
      return `You don't have permissions to modify pricings`;
    } else if (!isActiveJob) {
      return 'You cannot modify matches for inactive jobs';
    } else if (pricingInfo.CompanyPayMarkets_Linked_PayMarket_Name) {
      return 'You cannot modify matches for linked Pay Markets';
    } else if (pricingMatchCount <= 1) {
      return 'A pricing must have at least one match. You cannot delete the last match from a pricing.';
    } else {
      return '';
    }
  }
}
