import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { of } from 'rxjs';

import { UserApiService } from 'libs/data/payfactors-api';


@Injectable()
export class LoadUserGuard implements CanActivate {

    constructor(
        private userApiService: UserApiService,
        private router: Router
    ) { }

    loadUser(userId: number) {
        return this.userApiService.get(userId)
            .map(user => !!user)
            .catch(() => {
                this.router.navigate(['/access-denied']);
                return of(false);
            });
    }

    canActivate(route: ActivatedRouteSnapshot) {
        return this.loadUser(Number(route.params.userId));
    }
}
