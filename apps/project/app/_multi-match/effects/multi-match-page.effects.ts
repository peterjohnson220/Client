import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, tap, mergeMap, withLatestFrom, catchError } from 'rxjs/operators';
import { of } from 'rxjs/index';

import { SurveySearchApiService } from 'libs/data/payfactors-api';
import { SurveyJobMatchUpdate } from 'libs/models/payfactors-api';
import { WindowCommunicationService } from 'libs/core/services';
import * as fromSearchPageActions from 'libs/features/search/actions/search-page.actions';
import * as fromSearchFiltersActions from 'libs/features/search/actions/search-filters.actions';
import { SearchFilterMappingDataObj } from 'libs/features/search/models';

import * as fromContextActions from '../../survey-search/actions/context.actions';
import * as fromMultiMatchPageActions from '../actions/multi-match-page.actions';
import * as fromSurveySearchFiltersActions from '../../survey-search/actions/survey-search-filters.actions';
import { SurveySearchFiltersHelper } from '../../survey-search/helpers';
import { JobToPrice } from '../models';
import * as fromMultiMatchReducer from '../reducers';

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
                actions.push(new fromContextActions.SetProjectSearchContext(searchContext));
                actions.push(new fromSurveySearchFiltersActions.GetDefaultScopesFilter());
                if (projectContext.RestrictToCountryCode) {
                  actions.push(new fromSearchFiltersActions.AddFilters([
                    SurveySearchFiltersHelper.buildLockedCountryCodeFilter(searchContext.CountryCode,
                      this.searchFilterMappingDataObj)
                  ]));
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
        this.store.select(fromMultiMatchReducer.getJobsToPrice),
        this.store.select(fromMultiMatchReducer.getMultimatchProjectContext),
        (action, jobsToPrice, projectContext ) => ({  jobsToPrice, projectContext  })
      ),
      switchMap((contextAndJobs) => {
          const jobsWithUpdates = contextAndJobs.jobsToPrice.filter(j => (!!j.DataCutsToAdd && j.DataCutsToAdd.length)
                                  || (!!j.DeletedJobMatchCutIds && j.DeletedJobMatchCutIds.length));
          return this.surveySearchApiService.updateUserJobMatches({
            ProjectId: contextAndJobs.projectContext.ProjectId,
            SurveyJobMatchUpdates: this.buildMatchUpdates(jobsWithUpdates)
          })
            .pipe(
              mergeMap(() => [
                  new fromMultiMatchPageActions.SaveJobMatchUpdatesSuccess(),
                  new fromSearchPageActions.CloseSearchPage()
                ]
              ),
              catchError(() => of(new fromMultiMatchPageActions.SaveJobMatchUpdatesError()))
            );
        }
      )
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
      private store: Store<fromMultiMatchReducer.State>,
      private windowCommunicationService: WindowCommunicationService,
      private searchFilterMappingDataObj: SearchFilterMappingDataObj
  ) {}
}
