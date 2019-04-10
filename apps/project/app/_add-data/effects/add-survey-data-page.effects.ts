import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api';
import { WindowCommunicationService } from 'libs/core/services';
import { AddSurveyDataCutMatchResponse, DataCut } from 'libs/models/payfactors-api';
import * as fromSearchFiltersActionsShared from 'libs/features/search/actions/search-filters.actions';
import * as fromSearchPageActionsShared from 'libs/features/search/actions/search-page.actions';
import { SearchFilterMappingDataObj } from 'libs/features/search/models';

import * as fromAddSurveyDataPageActions from '../actions/add-survey-data-page.actions';
import * as fromContextActions from '../../survey-search/actions/context.actions';
import * as fromSurveySearchFiltersActions from '../../survey-search/actions/survey-search-filters.actions';
import { JobContext, ProjectSearchContext } from '../../survey-search/models';
import * as fromSurveySearchReducer from '../../survey-search/reducers';
import { SurveySearchFiltersHelper } from '../../survey-search/helpers';

@Injectable()
export class AddSurveyDataPageEffects {

  @Effect()
  setJobContext$ = this.actions$
    .ofType(fromContextActions.SET_JOB_CONTEXT)
    .pipe(
      withLatestFrom(this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        (action: fromContextActions.SetJobContext,
         projectSearchContext: ProjectSearchContext) => ({action, projectSearchContext})),
      mergeMap(context => {
        const actions = [];
        actions.push(new fromSearchFiltersActionsShared.SetDefaultValue(
          {filterId: 'jobTitleCode', value: context.action.payload.JobTitle}));
        actions.push(new fromSurveySearchFiltersActions.GetDefaultScopesFilter());

        if (context.projectSearchContext.RestrictToCountryCode) {
          actions.push(new fromSearchFiltersActionsShared.AddFilters([
            SurveySearchFiltersHelper.buildLockedCountryCodeFilter(context.projectSearchContext.CountryCode,
              this.searchFilterMappingDataObj)
          ]));
        }
        return actions;
       }
      )
    );

  @Effect()
  addSurveyData$ = this.actions$
    .ofType(fromAddSurveyDataPageActions.ADD_DATA)
    .pipe(
      // Get the current filters and paging options from the store
      withLatestFrom(
        this.store.select(fromSurveySearchReducer.getJobContext),
        this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        this.store.select(fromSurveySearchReducer.getSelectedDataCuts),
        (action: fromAddSurveyDataPageActions.AddData, jobContext: JobContext,
         projectSearchContext: ProjectSearchContext, selectedDataCuts: DataCut[]) =>
          ({ action, jobContext, selectedDataCuts, projectSearchContext })),
      switchMap(jobContextAndCuts => {
        return this.surveySearchApiService.addSurveyDataCuts({
          CompanyJobId: jobContextAndCuts.jobContext.CompanyJobId,
          ProjectId: jobContextAndCuts.projectSearchContext.ProjectId,
          JobDataCuts: jobContextAndCuts.selectedDataCuts,
          ExcludeFromParticipation: jobContextAndCuts.action.payload,
          PayMarketId : jobContextAndCuts.jobContext.JobPayMarketId,
          JobCode: jobContextAndCuts.jobContext.JobCode,
          CompanyPayMarketId: jobContextAndCuts.projectSearchContext.PayMarketId,
          PeerDataCuts: []
        })
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
    .ofType(fromAddSurveyDataPageActions.ADD_DATA_SUCCESS)
    .pipe(
      withLatestFrom(this.store.select(fromSurveySearchReducer.getJobContext),
        (action: fromAddSurveyDataPageActions.AddDataSuccess, jobContext: JobContext) => ({action, jobContext})),
      tap(jobContextAndMatches => {
        this.windowCommunicationService.postMessage(jobContextAndMatches.action.type,
          {
            jobMatches: jobContextAndMatches.action.payload
          });
      })
    );

    constructor(
      private actions$: Actions,
      private surveySearchApiService: SurveySearchApiService,
      private store: Store<fromSurveySearchReducer.State>,
      private windowCommunicationService: WindowCommunicationService,
      private searchFilterMappingDataObj: SearchFilterMappingDataObj
  ) {}
}
