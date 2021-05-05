import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { UserApiService } from 'libs/data/payfactors-api';

@Injectable()
export class LoadUserGuard implements CanActivate {

    constructor(
        private userApiService: UserApiService,
        private router: Router
    ) { }

    loadUser(userId: number) {
        return this.userApiService.get(userId)
          .pipe(
            map(user => !!user),
            catchError(() => {
                this.router.navigate(['/access-denied']);
                return of(false);
            }));
    }

    canActivate(route: ActivatedRouteSnapshot) {
        return this.loadUser(Number(route.params.userId));
    }
}
