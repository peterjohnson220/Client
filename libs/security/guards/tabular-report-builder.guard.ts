import {Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Data,
  Router,
  CanActivateChild
} from '@angular/router';

import { Observable, of } from 'rxjs';
import { PermissionService } from '../../core/services';

@Injectable()
export class TabularReportBuilderGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private permissionService: PermissionService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasAccess(next.data);
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.hasAccess(childRoute.parent.data);
  }

  private hasAccess(routeData: Data): Observable<boolean> {
    if (this.permissionService.CheckPermission(routeData.Permissions, routeData.Check)) {
      return of(true);
    } else {
      this.router.navigate(['/access-denied']);
      return of(false);
    }
  }
}
