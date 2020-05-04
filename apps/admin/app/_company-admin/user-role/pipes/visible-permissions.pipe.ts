import { Pipe, PipeTransform } from '@angular/core';
import { SystemPermission } from 'libs/models/security/roles/system-permission.model';

@Pipe({name: 'visiblePermission'})
export class VisiblePermissionsPipe implements PipeTransform {
  transform(permissions: SystemPermission[]) {
    if (!permissions) {
      return;
    }
    return permissions.filter(p => p.UiVisible);
  }
}
