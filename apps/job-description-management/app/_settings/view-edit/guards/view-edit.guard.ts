import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as fromViewEditReducer from '../reducers';

@Injectable()
export class ViewEditGuard implements CanActivate {
  constructor(
    private store: Store<fromViewEditReducer.State>,
    private router: Router
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      return this.store.select(fromViewEditReducer.getViewEditViewName).pipe(
        map(v => {
          if (!!v) {
            return true;
          } else {
            this.router.navigate(['settings/job-description-views']);
            return false;
          }
        })
      );
  }
}
