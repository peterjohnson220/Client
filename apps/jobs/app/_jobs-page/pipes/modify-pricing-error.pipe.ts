import { Pipe, PipeTransform } from '@angular/core';
import { PermissionService } from 'libs/core';
import { PermissionCheckEnum, Permissions } from 'libs/constants';

@Pipe({
  name: 'modifyPricingError',
  pure: true
})

export class ModifyPricingError implements PipeTransform {

  constructor(private permissionService: PermissionService) { }

  transform(isLinked: boolean, isActiveJob: boolean = true) {

    if (!this.permissionService.CheckPermission([Permissions.MODIFY_PRICINGS], PermissionCheckEnum.Single)) {
      return `You don't have permissions to modify pricings`;
    } else if (!isActiveJob) {
      return 'You cannot modify pricings for inactive jobs';
    } else if (isLinked) {
      return 'You cannot add adjustment for linked Pay Markets';
    } else {
      return '';
    }
  }
}
