import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { UserProfileApiService } from 'libs/data/payfactors-api/user';
import { JdmListFilter } from 'libs/models/user-profile';

import * as fromJdmFilterActions from '../actions/filter.actions';


@Injectable()
export class JdmFiltersEffects {

  @Effect()
  loadFilters$: Observable<Action> = this.actions$
    .ofType(fromJdmFilterActions.LOADING_FILTERS).pipe(
      switchMap(() =>
        this.userProfileApiService.getUserFilterList().pipe(
          map((userFilters: JdmListFilter[]) => new fromJdmFilterActions.LoadingFiltersSuccess({userFilters: userFilters})),
          catchError(error => of(new fromJdmFilterActions.LoadingFiltersError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private userProfileApiService: UserProfileApiService
  ) {}
}
