import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
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
import { PayfactorsSurveySearchApiModelMapper, SurveySearchFiltersHelper } from '../../survey-search/helpers';
import { JobToPrice } from '../models';
import * as fromMultiMatchReducer from '../reducers';
import * as fromSurveySearchReducer from '../../survey-search/reducers';

@Injectable()
export class MultiMatchEffects {

  @Effect()
  getProjectSearchContext$ = this.actions$
    .pipe(
      ofType(fromMultiMatchPageActions.GET_PROJECT_SEARCH_CONTEXT),
      map((action: fromMultiMatchPageActions.GetProjectSearchContext) => action.payload),
      switchMap((projectContext) => {
        return this.surveySearchApiService.getProjectSearchContext(projectContext.ProjectId)
          .pipe(
            mergeMap(response => {
                const actions = [];
                const searchContext = {
                  CountryCode: response.CountryCode,
                  CurrencyCode: response.CurrencyCode,
                  PaymarketId: response.PaymarketId,
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

  // TODO: Refactor to use the pricingMatchDataSearchContext as part of the save updates story for the jobs page
  @Effect()
  saveJobMatchUpdates$ = this.actions$
    .pipe(
      ofType(fromMultiMatchPageActions.SAVE_JOB_MATCH_UPDATES),
      withLatestFrom(
        this.store.select(fromMultiMatchReducer.getJobsToPrice),
        this.store.select(fromMultiMatchReducer.getMultimatchProjectContext),
        this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        (action, jobsToPrice, projectContext, projectSearchContext ) =>
          ({ jobsToPrice, projectContext, projectSearchContext })
      ),
      switchMap((contextAndJobs) => {
          const jobsWithUpdates = contextAndJobs.jobsToPrice.filter(j => (!!j.DataCutsToAdd && j.DataCutsToAdd.length)
                                  || (!!j.DeletedJobMatchCutIds && j.DeletedJobMatchCutIds.length));
          return this.surveySearchApiService.updateUserJobMatches({
            ProjectId: contextAndJobs.projectContext.ProjectId,
            CompanyPayMarketId: contextAndJobs.projectSearchContext.PaymarketId,
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
    .pipe(
      ofType(fromMultiMatchPageActions.SAVE_JOB_MATCH_UPDATES_SUCCESS),
      tap((action: fromMultiMatchPageActions.SaveJobMatchUpdatesSuccess) => {
        this.windowCommunicationService.postMessage(action.type);
      })
    );

  private buildMatchUpdates(jobsToPrice: JobToPrice[]): SurveyJobMatchUpdate[] {
    return jobsToPrice.map(job => {
      return {
        UserJobListTempId: job.Id,
        MatchesToDelete: job.DeletedJobMatchCutIds,
        DataCutMatchesToAdd: PayfactorsSurveySearchApiModelMapper.mapDataCutDetailsToJobDataCuts(job.DataCutsToAdd),
        PeerCutMatchesToAdd: PayfactorsSurveySearchApiModelMapper.mapDataCutDetailsToPeerCuts(job.DataCutsToAdd)
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
