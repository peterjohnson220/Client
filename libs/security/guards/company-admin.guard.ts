import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { catchError, map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import * as fromRootState from '../../state/state';
import { CompanySecurityApiService } from 'libs/data/payfactors-api/security/company-security-api.service';

@Injectable()
export class CompanyAdminGuard implements CanActivate {
  constructor(
    private store: Store<fromRootState.State>,
    private router: Router,
    private companySecurity: CompanySecurityApiService
  ) { }

  userIsCompanyAdmin(): Observable<boolean> {
    return this.companySecurity.getIsCompanyAdmin()
      .pipe(
        map(ret => {
          if (!ret) {
            window.location.href = '/ng/404';
            return false;
          } else {
            return ret;
          }
        }),
        catchError(error => {
          window.location.href = '/ng/404';
          return of(false);
        }));
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userIsCompanyAdmin();
  }
}
