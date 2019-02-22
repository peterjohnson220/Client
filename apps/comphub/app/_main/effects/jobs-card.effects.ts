import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { catchError, debounceTime, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubApiService } from 'libs/data/payfactors-api/comphub';
import { JobSearchApiService } from 'libs/data/payfactors-api/search/jobs';
import * as fromRootReducer from 'libs/state/state';

import * as fromJobsCardActions from '../actions/jobs-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import * as fromComphubReducer from '../reducers';
import { PayfactorsApiModelMapper, SmbClientHelper } from '../helpers';
import { ComphubPages } from '../data';

@Injectable()
export class JobsCardEffects {

  @Effect()
  getTrendingJobs$ = this.actions$
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

  @Effect()
  setSelectedJob$ = this.actions$
    .ofType(fromJobsCardActions.SET_SELECTED_JOB)
    .pipe(
      map((action: fromJobsCardActions.SetSelectedJob) => action.payload),
      mergeMap((payload) => {
        const actions = [];

        actions.push(new fromComphubPageActions.ResetAccessiblePages());
        actions.push(new fromDataCardActions.ClearSelectedJobData());
        actions.push( new fromComphubPageActions.UpdateCardSubtitle({ cardId: ComphubPages.Jobs, subTitle: payload.jobTitle}));
        actions.push(new fromComphubPageActions.AddAccessiblePages([ComphubPages.Markets, ComphubPages.Data]));

        if (payload.navigateToNextCard) {
          actions.push(new fromComphubPageActions.NavigateToNextCard());
        }

        return actions;
      })
    );

  @Effect()
  clearSelectedJob$ = this.actions$
    .ofType(fromJobsCardActions.CLEAR_SELECTED_JOB)
    .pipe(
      mergeMap(() => [
        new fromComphubPageActions.ResetAccessiblePages(),
        new fromDataCardActions.ClearSelectedJobData()
      ])
    );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubReducer.State>,
    private comphubApiService: ComphubApiService,
    private jobSearchApiService: JobSearchApiService
  ) {
  }
}
