import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import * as fromRootState from '../../state/state';
import { CompanySecurityApiService } from 'libs/data/payfactors-api/security/company-security-api.service';

@Injectable()
export class CompanyAdminGuard implements CanActivate {
  constructor(
    private store: Store<fromRootState.State>,
    private router: Router,
    private companySecurity: CompanySecurityApiService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    let s: boolean;

    this.companySecurity.getIsCompanyAdmin().pipe(take(1)).subscribe(ret => s = ret);

    if (!s) {
      window.location.href = '/ng/404';
    }

    return s;
  }
}
