import {Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Data,
  Router,
  CanActivateChild
} from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';

import * as fromRootState from '../../state/state';

import { UserContext } from '../../models/security';
import { PermissionService } from '../../core/services';

@Injectable()
export class AuthorizationGuard implements CanActivate, CanActivateChild {
  userContext$: Observable<UserContext>;

  constructor(
    private router: Router,
    private store: Store<fromRootState.State>,
    private permissionService: PermissionService
  ) {
    this.userContext$ = this.store.select(fromRootState.getUserContext);
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userContext$.pipe(filter(uc => !!uc)).switchMap(uc => this.hasAccess(uc, next.data));
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userContext$.pipe(filter(uc => !!uc)).switchMap(uc => this.hasAccess(uc, childRoute.parent.data));
  }

  private hasAccess(userContext: UserContext, routeData: Data): Observable<boolean> {
    if (userContext.AccessLevel === 'Admin') {
      return of(true);
    } else if (this.permissionService.CheckPermission(routeData.Permissions, routeData.Check)) {
      return of(true);
    } else {
      this.router.navigate(['/access-denied']);
      return of(false);
    }
  }
}
