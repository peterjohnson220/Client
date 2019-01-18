import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubApiService } from 'libs/data/payfactors-api/comphub';
import { JobSearchApiService } from 'libs/data/payfactors-api/search/jobs';

import * as fromJobsPageActions from '../actions/jobs-page.actions';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';

@Injectable()
export class JobsPageEffects {

  @Effect()
  setContext$ = this.actions$
    .ofType(fromJobsPageActions.GET_TRENDING_JOBS)
    .pipe(
      switchMap(() => {
          return this.comphubApiService.getTrendingJobs()
            .pipe(
              map(response => {
                const trendingJobGroups = PayfactorsApiModelMapper.mapTrendingJobGroupsResponseToTrendingJobGroups(response);
                return new fromJobsPageActions.GetTrendingJobsSuccess(trendingJobGroups);
              }),
              catchError(() => of(new fromJobsPageActions.GetTrendingJobsError()))
            );
        }
      ));

  @Effect()
  getJobSearchOptions$ = this.actions$
    .ofType(fromJobsPageActions.GET_JOB_SEARCH_OPTIONS)
    .pipe(
      switchMap((action: fromJobsPageActions.GetJobSearchOptions) => {
          return this.jobSearchApiService.getJobSearchAutocompleteResults({Prefix: action.payload})
            .pipe(
              map(response => {
                return new fromJobsPageActions.GetJobSearchOptionsSuccess(response);
              }),
              catchError(() => of(new fromJobsPageActions.GetJobSearchOptionsError()))
            );
        }
      ));

  constructor(
    private actions$: Actions,
    private comphubApiService: ComphubApiService,
    private jobSearchApiService: JobSearchApiService,
  ) {
  }
}
