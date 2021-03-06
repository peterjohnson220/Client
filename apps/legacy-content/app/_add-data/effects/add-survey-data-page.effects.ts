import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api';
import { WindowCommunicationService } from 'libs/core/services';
import { AddSurveyDataCutMatchResponse } from 'libs/models/payfactors-api';
import * as fromSearchFiltersActionsShared from 'libs/features/search/search/actions/search-filters.actions';
import * as fromSearchPageActionsShared from 'libs/features/search/search/actions/search-page.actions';

import * as fromAddSurveyDataPageActions from '../actions/add-survey-data-page.actions';
import * as fromContextActions from 'libs/features/surveys/survey-search/actions/context.actions';
import * as fromSurveySearchFiltersActions from 'libs/features/surveys/survey-search/actions/survey-search-filters.actions';
import * as fromSurveySearchResultsActions from 'libs/features/surveys/survey-search/actions/survey-search-results.actions';
import { DataCutDetails, JobContext, ProjectSearchContext } from 'libs/features/surveys/survey-search/models';
import * as fromSurveySearchReducer from 'libs/features/surveys/survey-search/reducers';
import { PayfactorsSurveySearchApiModelMapper, SurveySearchFiltersHelper } from 'libs/features/surveys/survey-search/helpers';
import * as fromSearchReducer from 'libs/features/search/search/reducers';

@Injectable()
export class AddSurveyDataPageEffects {

  @Effect()
  setJobContext$ = this.actions$
    .pipe(
      ofType(fromContextActions.SET_JOB_CONTEXT),
      withLatestFrom(
        this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        this.store.select(fromSearchReducer.getSearchFilterMappingData),
        (action: fromContextActions.SetJobContext,
         projectSearchContext: ProjectSearchContext, searchFilterMappingDataObj) => ({action, projectSearchContext, searchFilterMappingDataObj})),
      mergeMap(context => {
        const actions = [];
        actions.push(new fromSearchFiltersActionsShared.SetDefaultValue(
          {filterId: 'jobTitleCode', value: context.action.payload.JobTitle}));
        actions.push(new fromSurveySearchFiltersActions.GetDefaultScopesFilter());

        if (context.projectSearchContext.RestrictToCountryCode) {
          actions.push(new fromSearchFiltersActionsShared.AddFilters([
            SurveySearchFiltersHelper.buildLockedCountryCodeFilter(context.projectSearchContext.CountryCode,
              context.searchFilterMappingDataObj)
          ]));
        }
        return actions;
       }
      )
    );

  @Effect()
  addSurveyData$ = this.actions$
    .pipe(
      ofType(fromAddSurveyDataPageActions.ADD_DATA),
      // Get the current filters and paging options from the store
      withLatestFrom(
        this.store.select(fromSurveySearchReducer.getJobContext),
        this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        this.store.select(fromSurveySearchReducer.getSelectedDataCuts),
        (action: fromAddSurveyDataPageActions.AddData, jobContext: JobContext,
         projectSearchContext: ProjectSearchContext, selectedDataCuts: DataCutDetails[]) =>
          ({ action, jobContext, selectedDataCuts, projectSearchContext })),
      switchMap(jobContextAndCuts => {
        return this.surveySearchApiService.addSurveyDataCuts(
          PayfactorsSurveySearchApiModelMapper.buildAddSurveyDataCutRequest(
          jobContextAndCuts.action.payload,
          jobContextAndCuts.jobContext,
          jobContextAndCuts.projectSearchContext,
          jobContextAndCuts.selectedDataCuts)
        )
          .pipe(
            mergeMap((addResponse: AddSurveyDataCutMatchResponse) => [
                new fromAddSurveyDataPageActions.AddDataSuccess(addResponse.JobMatchIds),
                new fromSearchPageActionsShared.CloseSearchPage()
              ]
            ),
            catchError(() => of(new fromAddSurveyDataPageActions.AddDataError()))
          );
      })
    );

  @Effect({dispatch: false})
  addDataSuccess$ = this.actions$
    .pipe(
      ofType(fromAddSurveyDataPageActions.ADD_DATA_SUCCESS),
      withLatestFrom(this.store.select(fromSurveySearchReducer.getJobContext),
        (action: fromAddSurveyDataPageActions.AddDataSuccess, jobContext: JobContext) => ({action, jobContext})),
      tap(jobContextAndMatches => {
        this.windowCommunicationService.postMessage(jobContextAndMatches.action.type,
          {
            jobMatches: jobContextAndMatches.action.payload
          });
      })
    );

  @Effect({dispatch: false})
  refineExchangeJobResult$ = this.actions$
    .pipe(
      ofType(fromSurveySearchResultsActions.REFINE_EXCHANGE_JOB_RESULT),
      tap((action: fromSurveySearchResultsActions.RefineExchangeJobResult) => {
        this.windowCommunicationService.postMessage(action.type, action.payload);
      })
    );

    constructor(
      private actions$: Actions,
      private surveySearchApiService: SurveySearchApiService,
      private store: Store<fromSurveySearchReducer.State>,
      private windowCommunicationService: WindowCommunicationService
  ) {}
}
