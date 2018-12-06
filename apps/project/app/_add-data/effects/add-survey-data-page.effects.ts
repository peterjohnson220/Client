import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api';
import { WindowCommunicationService } from 'libs/core/services';
import { AddSurveyDataCutMatchResponse, DataCut } from 'libs/models/survey-search';

import * as fromAddSurveyDataPageActions from '../actions/add-survey-data-page.actions';
import * as fromSearchFiltersActions from '../../shared/actions/search-filters.actions';
import * as fromSearchActions from '../../shared/actions/search.actions';
import { JobContext, ProjectSearchContext } from '../../shared/models';
import * as fromSharedReducer from '../../shared/reducers';
import { FiltersHelper } from '../../shared/helpers';

@Injectable()
export class AddSurveyDataPageEffects {

  @Effect()
  setJobContext$ = this.actions$
    .ofType(fromSearchActions.SET_JOB_CONTEXT)
    .pipe(
      withLatestFrom(this.store.select(fromSharedReducer.getProjectSearchContext),
        (action: fromSearchActions.SetJobContext,
         projectSearchContext: ProjectSearchContext) => ({action, projectSearchContext})),
      mergeMap(context => {
        const actions = [];
        actions.push(new fromSearchFiltersActions.SetDefaultValue({filterId: 'jobTitleCode', value: context.action.payload.JobTitle}));
        actions.push(new fromSearchFiltersActions.GetDefaultScopesFilter());

        if (context.projectSearchContext.RestrictToCountryCode) {
          actions.push(new fromSearchFiltersActions.AddFilters([
            FiltersHelper.buildLockedCountryCodeFilter(context.projectSearchContext.CountryCode)
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
        this.store.select(fromSharedReducer.getJobContext),
        this.store.select(fromSharedReducer.getProjectSearchContext),
        this.store.select(fromSharedReducer.getSelectedDataCuts),
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
                new fromSearchActions.CloseSearchPage()
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
      withLatestFrom(this.store.select(fromSharedReducer.getJobContext),
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
      private store: Store<fromSharedReducer.State>,
      private windowCommunicationService: WindowCommunicationService
  ) {}
}
