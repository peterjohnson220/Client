import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CompanyApiService } from 'libs/data/payfactors-api';

@Injectable()
export class LoadCompanyGuard implements CanActivate {

    constructor(
        private companyApiService: CompanyApiService,
        private router: Router
    ) { }

    loadCompany(companyId: number) {
        return this.companyApiService.get(companyId)
          .pipe(
            map(company => !!company),
            catchError(() => {
                this.router.navigate(['/access-denied']);
                return of(false);
            }));
    }

    canActivate(route: ActivatedRouteSnapshot) {
        return this.loadCompany(Number(route.params.companyId));
    }
}
