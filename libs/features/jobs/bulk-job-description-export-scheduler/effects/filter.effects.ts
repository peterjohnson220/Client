import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { UserProfileApiService } from 'libs/data/payfactors-api/user';
import { GetUserFilterListResponse } from 'libs/models/payfactors-api/user-filter/response/get-user-filter-list-response.model';
import { PayfactorsApiModelMapper } from 'libs/features/jobs/job-description-management/helpers';

import * as fromFilterActions from '../actions/filter.actions';

@Injectable()
export class BulkJobsExportScheduleFiltersEffects {

  @Effect()
  loadFilters$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromFilterActions.LOADING_FILTERS),
      switchMap(() =>
        this.userProfileApiService.getUserFilterList().pipe(
          map((response: GetUserFilterListResponse[]) => {
            const newResponse = response.map(r => {
              return {
                Id: r.Id,
                Name: r.Name,
                CompositeFilter: PayfactorsApiModelMapper.mapCompositeFilterUppercaseToCompositeFilter(r.CompositeFilter)
              };
            });

            return new fromFilterActions.LoadingFiltersSuccess({ userFilters: newResponse });
          }),
          catchError(error => of(new fromFilterActions.LoadingFiltersError(error)))
        )
      )
    );

  constructor(
    private actions$: Actions,
    private userProfileApiService: UserProfileApiService
  ) {}
}
