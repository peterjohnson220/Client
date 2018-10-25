import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, tap, mergeMap, withLatestFrom, catchError } from 'rxjs/operators';
import { of } from 'rxjs/index';

import { SurveySearchApiService } from 'libs/data/payfactors-api';
import { SurveyJobMatchUpdate } from 'libs/models/survey-search';
import { WindowCommunicationService } from 'libs/core/services';

import * as fromMultiMatchPageActions from '../actions/multi-match-page.actions';
import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import * as fromAddDataReducer from '../reducers';

import * as fromSearchActions from '../actions/search.actions';
import { buildLockedCountryCodeFilter } from '../helpers';
import { JobToPrice } from '../models';

@Injectable()
export class MultiMatchPageEffects {

  @Effect()
  getProjectSearchContext$ = this.actions$
    .ofType(fromMultiMatchPageActions.GET_PROJECT_SEARCH_CONTEXT)
    .pipe(
      map((action: fromMultiMatchPageActions.GetProjectSearchContext) => action.payload),
      switchMap((projectContext) => {
        return this.surveySearchApiService.getProjectSearchContext(projectContext.ProjectId)
          .pipe(
            mergeMap(response => {
                const actions = [];
                const searchContext = {
                  CountryCode: response.CountryCode,
                  CurrencyCode: response.CurrencyCode,
                  PayMarketId: response.PaymarketId,
                  ProjectId: response.ProjectId,
                  Rate: response.Rate,
                  RestrictToCountryCode: projectContext.RestrictToCountryCode
                };
                actions.push(new fromSearchActions.SetProjectSearchContext(searchContext));
                actions.push(new fromSearchFiltersActions.GetDefaultScopesFilter());
                if (projectContext.RestrictToCountryCode) {
                  actions.push(new fromSearchFiltersActions.AddFilter(buildLockedCountryCodeFilter(searchContext)));
                }
                return actions;
              }
            )
          );
        }
      )
    );

  @Effect()
  saveJobMatchUpdates$ = this.actions$
    .ofType(fromMultiMatchPageActions.SAVE_JOB_MATCH_UPDATES)
    .pipe(
      withLatestFrom(
        this.store.select(fromAddDataReducer.getJobsToPrice),
        this.store.select(fromAddDataReducer.getMultimatchProjectContext),
        (action, jobsToPrice, projectContext ) => ({  jobsToPrice, projectContext  })
      ),
      switchMap((contextAndJobs) => {
          return this.surveySearchApiService.updateUserJobMatches({
            ProjectId: contextAndJobs.projectContext.ProjectId,
            SurveyJobMatchUpdates: this.buildMatchUpdates(contextAndJobs.jobsToPrice)
          })
            .pipe(
              mergeMap(() => [
                  new fromMultiMatchPageActions.SaveJobMatchUpdatesSuccess(),
                  new fromMultiMatchPageActions.CloseMultiMatch()
                ]
              ),
              catchError(() => of(new fromMultiMatchPageActions.SaveJobMatchUpdatesError()))
            );
        }
      )
    );

  @Effect({dispatch: false})
  closeMultimatchApp$ = this.actions$
    .ofType(fromMultiMatchPageActions.CLOSE_MULTI_MATCH)
    .pipe(
      tap((action: fromMultiMatchPageActions.CloseMultiMatch) => {
        this.windowCommunicationService.postMessage(action.type);
      })
    );

  @Effect({dispatch: false})
  saveJobMatchUpdatesSuccess$ = this.actions$
    .ofType(fromMultiMatchPageActions.SAVE_JOB_MATCH_UPDATES_SUCCESS)
    .pipe(
      tap((action: fromMultiMatchPageActions.SaveJobMatchUpdatesSuccess) => {
        this.windowCommunicationService.postMessage(action.type);
      })
    );

  private buildMatchUpdates(jobsToPrice: JobToPrice[]): SurveyJobMatchUpdate[] {
    return jobsToPrice.map(job => {
      return {
        UserJobListTempId: job.Id,
        MatchesToDelete: job.DeletedJobMatchCutIds,
        DataCutMatchesToAdd: job.DataCutsToAdd
      };
    });
  }

    constructor(
      private actions$: Actions,
      private surveySearchApiService: SurveySearchApiService,
      private store: Store<fromAddDataReducer.State>,
      private windowCommunicationService: WindowCommunicationService
  ) {}
}
