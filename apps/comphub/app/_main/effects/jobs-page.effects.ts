import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubApiService } from 'libs/data/payfactors-api/comphub';

import * as fromJobsPageActions from '../actions/jobs-page.actions';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';

@Injectable()
export class JobsPageEffects {

  @Effect()
  setContext$ = this.actions$
    .ofType(fromJobsPageActions.GET_TRENDING_JOBS)
    .pipe(
      switchMap(() => {
          return this.comphubApiService.getTrendingJobs('')
            .pipe(
              map(response => {
                const trendingJobs = PayfactorsApiModelMapper.mapTrendingJobsResponseToTrendingJobs(response);
                return new fromJobsPageActions.GetTrendingJobsSuccess(trendingJobs);
              }),
              catchError(() => of(new fromJobsPageActions.GetTrendingJobsError()))
            );
        }
      ));

  constructor(
    private actions$: Actions,
    private comphubApiService: ComphubApiService
  ) {
  }
}
