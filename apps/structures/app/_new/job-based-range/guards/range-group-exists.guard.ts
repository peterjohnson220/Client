import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { StructureRangeGroupApiService } from 'libs/data/payfactors-api/structures';

import * as fromPageActions from '../actions/page.actions';
import * as fromJobBasedRangeReducer from '../reducers';

@Injectable()
export class RangeGroupExistsGuard implements CanActivate {

  constructor(
    private store: Store<fromJobBasedRangeReducer.State>,
    private structureRangeGroupApiService: StructureRangeGroupApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  rangeGroupExists(rangeGroupId: number): Observable<boolean> {
    return this.structureRangeGroupApiService.getCompanyStructureRangeGroup(rangeGroupId).pipe(
      map((response) => {
        if (response) {
          this.store.dispatch(new fromPageActions.SetPageTitle({ pageTitle: response.RangeGroupName}));
          return true;
        } else {
          this.router.navigate(['not-found'], { relativeTo: this.route });
          return false;
        }
      })
    );
  }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.rangeGroupExists(route.params.id);
  }
}
