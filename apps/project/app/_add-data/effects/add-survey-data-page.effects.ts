import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api';
import { WindowCommunicationService } from 'libs/core/services';
import { AddSurveyDataCutMatchResponse, DataCut } from 'libs/models/survey-search';

import * as fromAddSurveyDataPageActions from '../actions/add-survey-data-page.actions';
import * as fromSearchFiltersActions from '../actions/search-filters.actions';
import {  buildLockedCountryCodeFilter } from '../helpers';
import { JobContext, ProjectSearchContext } from '../models';
import * as fromAddDataReducer from '../reducers';


@Injectable()
export class AddSurveyDataPageEffects {

  @Effect()
  setJobContext$ = this.actions$
    .ofType(fromAddSurveyDataPageActions.SET_JOB_CONTEXT)
    .pipe(
      withLatestFrom(this.store.select(fromAddDataReducer.getProjectSearchContext),
        (action: fromAddSurveyDataPageActions.SetJobContext,
         projectSearchContext: ProjectSearchContext) => ({action, projectSearchContext})),
      mergeMap(context => {
        const actions = [];
        actions.push(new fromSearchFiltersActions.GetDefaultScopesFilter());
        actions.push(new fromSearchFiltersActions.SetDefaultValue({filterId: 'jobTitleCode', value: context.action.payload.JobTitle}));

        if (context.projectSearchContext.RestrictToCountryCode) {
          actions.push(new fromSearchFiltersActions.AddFilter(buildLockedCountryCodeFilter(context.projectSearchContext)));
        }
        return actions;
       }
      )
    );

  @Effect({dispatch: false})
  closeSurveySearch$ = this.actions$
    .ofType(fromAddSurveyDataPageActions.CLOSE_SURVEY_SEARCH)
    .pipe(
      tap((action: fromAddSurveyDataPageActions.CloseSurveySearch) => {
        this.windowCommunicationService.postMessage(action.type);
      })
    );

  @Effect()
  addSurveyData$ = this.actions$
    .ofType(fromAddSurveyDataPageActions.ADD_DATA)
    .pipe(
      // Get the current filters and paging options from the store
      withLatestFrom(
        this.store.select(fromAddDataReducer.getJobContext),
        this.store.select(fromAddDataReducer.getProjectSearchContext),
        this.store.select(fromAddDataReducer.getSelectedDataCuts),
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
          JobCode: jobContextAndCuts.jobContext.JobCode
        })
          .pipe(
            mergeMap((addResponse: AddSurveyDataCutMatchResponse) => [
                new fromAddSurveyDataPageActions.AddDataSuccess(addResponse.JobMatchIds),
                new fromAddSurveyDataPageActions.CloseSurveySearch()
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
      withLatestFrom(this.store.select(fromAddDataReducer.getJobContext),
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
      private store: Store<fromAddDataReducer.State>,
      private windowCommunicationService: WindowCommunicationService
  ) {}
}
