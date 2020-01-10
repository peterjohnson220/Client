import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromReducer from '../reducers';

@Injectable()
export class CompanyControlsDetailViewGuard implements CanActivate {
  constructor(
    private store: Store<fromReducer.State>,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this.store.select(fromReducer.getControlBeingViewed).pipe(
        map(v => {
          if (!!v) {
            return true;
          } else {
            this.router.navigate(['settings/company-controls']);
            return false;
          }
        })
      );
  }
}
