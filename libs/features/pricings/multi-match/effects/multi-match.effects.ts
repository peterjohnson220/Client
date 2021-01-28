import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { switchMap, map, tap, mergeMap, withLatestFrom, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs/index';

import { ExchangeDataCutsApiService, SurveySearchApiService } from 'libs/data/payfactors-api';
import { SurveyJobMatchUpdate } from 'libs/models/payfactors-api';
import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { WindowCommunicationService } from 'libs/core/services';
import * as fromSearchPageActions from 'libs/features/search/search/actions/search-page.actions';
import * as fromSearchFiltersActions from 'libs/features/search/search/actions/search-filters.actions';
import * as fromSearchReducer from 'libs/features/search/search/reducers';

import * as fromContextActions from '../../../surveys/survey-search/actions/context.actions';
import * as fromMultiMatchPageActions from '../actions/multi-match-page.actions';
import * as fromSurveySearchFiltersActions from '../../../surveys/survey-search/actions/survey-search-filters.actions';
import { PayfactorsSurveySearchApiModelMapper, SurveySearchFiltersHelper } from '../../../surveys/survey-search/helpers';
import { JobToPrice } from '../models';
import * as fromMultiMatchReducer from '../reducers';
import * as fromSurveySearchReducer from '../../../surveys/survey-search/reducers';
import * as fromDataCutValidationActions from '../../../peer/actions/data-cut-validation.actions';
import { ProjectSearchContext } from '../../../surveys/survey-search/models';
import { DataCutValidationInfo } from '../../../../models';

@Injectable()
export class MultiMatchEffects {

  @Effect()
  getProjectSearchContext$ = this.actions$
    .pipe(
      ofType(fromMultiMatchPageActions.GET_PROJECT_SEARCH_CONTEXT),
      withLatestFrom(
        this.store.select(fromSearchReducer.getSearchFilterMappingData),
        (action: fromMultiMatchPageActions.GetProjectSearchContext, searchFilterMappingDataObj ) =>
          ({ action, searchFilterMappingDataObj })
      ),
      switchMap((data) => {
        return this.surveySearchApiService.getProjectSearchContext(data.action.payload.ProjectId)
          .pipe(
            mergeMap(response => {
                const actions = [];
                const searchContext = {
                  CountryCode: response.CountryCode,
                  CurrencyCode: response.CurrencyCode,
                  PaymarketId: response.PaymarketId,
                  ProjectId: response.ProjectId,
                  Rate: response.Rate,
                  RestrictToCountryCode: data.action.payload.RestrictToCountryCode
                };
                actions.push(new fromContextActions.SetProjectSearchContext(searchContext));
                actions.push(new fromSurveySearchFiltersActions.GetDefaultScopesFilter());
                if (data.action.payload.RestrictToCountryCode) {
                  actions.push(new fromSearchFiltersActions.AddFilters([
                    SurveySearchFiltersHelper.buildLockedCountryCodeFilter(searchContext.CountryCode,
                      data.searchFilterMappingDataObj)
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
        this.store.select(fromSurveySearchReducer.getTempExchangeJobDataCutFilterContextDictionary),
        (action, jobsToPrice, projectContext, projectSearchContext, tempPeerDataCutFilterContextDictionary ) =>
          ({ jobsToPrice, projectContext, projectSearchContext, tempPeerDataCutFilterContextDictionary })
      ),
      switchMap((contextAndJobs) => {
          const jobsWithUpdates = contextAndJobs.jobsToPrice.filter(j => (!!j.DataCutsToAdd && j.DataCutsToAdd.length)
                                  || (!!j.DeletedJobMatchCutIds && j.DeletedJobMatchCutIds.length));
          return this.surveySearchApiService.updateUserJobMatches({
            ProjectId: contextAndJobs.projectContext.ProjectId,
            CompanyPayMarketId: contextAndJobs.projectSearchContext.PaymarketId,
            SurveyJobMatchUpdates: this.buildMatchUpdates(jobsWithUpdates, contextAndJobs.tempPeerDataCutFilterContextDictionary)
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

  @Effect()
  loadTempDataCutValidation$ = this.actions$
    .pipe(
      ofType(fromDataCutValidationActions.LOAD_TEMP_DATA_CUT_VALIDATION),
      withLatestFrom(
        this.store.select(fromMultiMatchReducer.getJobsToPrice),
        this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        (action: fromDataCutValidationActions.LoadTempDataCutValidation, jobsToPrice, projectContext: ProjectSearchContext) =>
          ({ actionPayload: action.payload, jobsToPrice, projectContext})
      ),
      switchMap((contextAndJobs) => {
          const jobsToPrice: JobToPrice[] = contextAndJobs.jobsToPrice;
          const companyJobIds = jobsToPrice.map((job) => job.CompanyJobId);
          let request$: Observable<DataCutValidationInfo[]>;

          if (contextAndJobs.actionPayload.hasProjectContext) {
            request$ = this.exchangeDataCutsApiService.getProjectMultiMatchDataCutValidationInfo({
              ProjectId: contextAndJobs.projectContext.ProjectId,
              CompanyJobIds: companyJobIds
            });
          } else {
            request$ = this.exchangeDataCutsApiService.getPricingMultiMatchDataCutValidationInfo({
              JobPricingIds: jobsToPrice.map((job) => job.Id),
              CompanyJobIds: companyJobIds
            });
          }
          return request$.pipe(
              map((response) => new fromDataCutValidationActions.LoadDataCutValidationSuccess(response)),
              catchError(() => of(new fromDataCutValidationActions.LoadDataCutValidationError()))
            );
        }
      )
    );

  private buildMatchUpdates(jobsToPrice: JobToPrice[], tempPeerDataCutFilterContextDictionary: {[key: string]: BaseExchangeDataSearchRequest}): SurveyJobMatchUpdate[] {
    return jobsToPrice.map(job => {
      return {
        UserJobListTempId: job.Id,
        MatchesToDelete: job.DeletedJobMatchCutIds,
        DataCutMatchesToAdd: PayfactorsSurveySearchApiModelMapper.mapDataCutDetailsToJobDataCuts(job.DataCutsToAdd),
        PeerCutMatchesToAdd: PayfactorsSurveySearchApiModelMapper.mapDataCutDetailsToPeerCuts(job.DataCutsToAdd),
        TempPeerCutMatchesToAdd: PayfactorsSurveySearchApiModelMapper.mapDataCutDetailsToTempPeerDataCuts(
          job.DataCutsToAdd,
          tempPeerDataCutFilterContextDictionary
        )
      };
    });
  }

    constructor(
      private actions$: Actions,
      private surveySearchApiService: SurveySearchApiService,
      private exchangeDataCutsApiService: ExchangeDataCutsApiService,
      private store: Store<fromMultiMatchReducer.State>,
      private windowCommunicationService: WindowCommunicationService
  ) {}
}
