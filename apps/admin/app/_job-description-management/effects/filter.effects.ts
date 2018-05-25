import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toArray';

import * as fromJdmFilterActions from '../actions/filter.actions';
import { UserProfileApiService } from 'libs/data/payfactors-api/user-profile';
import { UserFilter } from 'libs/models/user-profile';

@Injectable()
export class JdmFiltersEffects {

  @Effect()
  loadFilters$: Observable<Action> = this.actions$
    .ofType(fromJdmFilterActions.LOADING_FILTERS)
    .switchMap(() =>
      this.userProfileApiService.getUserFilterList()
        .map((userFilters: UserFilter[]) => new fromJdmFilterActions.LoadingFiltersSuccess({userFilters: userFilters}))
        .catch(error => of(new fromJdmFilterActions.LoadingFiltersError(error)))
    );

  constructor(
    private actions$: Actions,
    private userProfileApiService: UserProfileApiService
  ) {}
}
