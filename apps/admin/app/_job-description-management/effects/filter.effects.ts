import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import * as fromJdmFilterActions from '../actions/filter.actions';
import { UserProfileApiService } from 'libs/data/payfactors-api/user-profile';
import { UserFilter } from 'libs/models/user-profile';

@Injectable()
export class JdmFiltersEffects {

  @Effect()
  loadFilters$: Observable<Action> = this.actions$
    .ofType(fromJdmFilterActions.LOADING_FILTERS).pipe(
      switchMap(() =>
        this.userProfileApiService.getUserFilterList().pipe(
          map((userFilters: UserFilter[]) => new fromJdmFilterActions.LoadingFiltersSuccess({userFilters: userFilters})),
          catchError(error => of(new fromJdmFilterActions.LoadingFiltersError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private userProfileApiService: UserProfileApiService
  ) {}
}
