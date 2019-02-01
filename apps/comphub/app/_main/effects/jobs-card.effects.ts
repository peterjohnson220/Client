import { Injectable } from '@angular/core';

import { Actions, Effect } from '@ngrx/effects';
import { map, catchError, switchMap, debounceTime } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubApiService } from 'libs/data/payfactors-api/comphub';
import { JobSearchApiService } from 'libs/data/payfactors-api/search/jobs';

import * as fromJobsCardActions from '../actions/jobs-card.actions';
import { PayfactorsApiModelMapper } from '../helpers/payfactors-api-model-mapper';

@Injectable()
export class JobsCardEffects {

  @Effect()
  setContext$ = this.actions$
    .ofType(fromJobsCardActions.GET_TRENDING_JOBS)
    .pipe(
      switchMap(() => {
          return this.comphubApiService.getTrendingJobs()
            .pipe(
              map(response => {
                const trendingJobGroups = PayfactorsApiModelMapper.mapTrendingJobGroupsResponseToTrendingJobGroups(response);
                return new fromJobsCardActions.GetTrendingJobsSuccess(trendingJobGroups);
              }),
              catchError(() => of(new fromJobsCardActions.GetTrendingJobsError()))
            );
        }
      ));

  @Effect()
  getJobSearchOptions$ = this.actions$
    .ofType(fromJobsCardActions.GET_JOB_SEARCH_OPTIONS)
    .pipe(
      debounceTime(100),
      switchMap((action: fromJobsCardActions.GetJobSearchOptions) => {
          return this.jobSearchApiService.getJobSearchAutocompleteResults({Prefix: action.payload})
            .pipe(
              map(response => {
                return new fromJobsCardActions.GetJobSearchOptionsSuccess(response);
              }),
              catchError(() => of(new fromJobsCardActions.GetJobSearchOptionsError()))
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
