import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { of } from 'rxjs';

import { CompanyApiService } from 'libs/data/payfactors-api';


@Injectable()
export class LoadCompanyGuard implements CanActivate {

    constructor(
        private companyApiService: CompanyApiService,
        private router: Router
    ) { }

    loadCompany(companyId: number) {
        return this.companyApiService.get(companyId)
            .map(company => !!company)
            .catch(() => {
                this.router.navigate(['/access-denied']);
                return of(false);
            });
    }

    canActivate(route: ActivatedRouteSnapshot) {
        return this.loadCompany(Number(route.params.companyId));
    }
}
