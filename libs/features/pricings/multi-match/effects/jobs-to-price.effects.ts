import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { SurveySearchApiService, JobsApiService } from 'libs/data/payfactors-api';

import { PayfactorsApiModelMapper } from '../helpers';
import { ProjectSearchContext } from '../../../surveys/survey-search/models';

import * as fromJobsToPriceActions from '../actions/jobs-to-price.actions';
import * as fromMultiMatchReducer from '../reducers';
import * as fromSurveySearchReducer from '../../../surveys/survey-search/reducers';

@Injectable()
export class JobsToPriceEffects {

  @Effect()
  getJobsToPrice$ = this.actions$
    .pipe(
      ofType(fromJobsToPriceActions.GET_JOBS_TO_PRICE),
      map((action: fromJobsToPriceActions.GetJobsToPrice) => action.payload),
      switchMap((projectContext) => {
        return this.surveySearchApiService.getJobsToPrice({
          JobMatchIds: projectContext.JobValues.map(x => Number(x)),
          ProjectId: projectContext.ProjectId
        }).pipe(
            map(response => new fromJobsToPriceActions.GetJobsToPriceSuccess(
              PayfactorsApiModelMapper.mapMatchedSurveyJobToJobsToPrice(response))
            ),
            catchError(() => of(new fromJobsToPriceActions.GetJobsToPriceError()))
          );
        }
      )
    );

  @Effect()
  getJobMatchCuts$ = this.actions$
    .pipe(
      ofType(fromJobsToPriceActions.GET_MATCH_JOB_CUTS),
      withLatestFrom(this.store.select(fromSurveySearchReducer.getProjectSearchContext),
        (action: fromJobsToPriceActions.GetMatchJobCuts,
         projectSearchContext: ProjectSearchContext) => ({action, projectSearchContext})),
      switchMap((projectAndPayload) => {
          const jobToPrice = projectAndPayload.action.payload;
          return this.surveySearchApiService.getJobMatchCuts({
            ProjectId: projectAndPayload.projectSearchContext.ProjectId,
            JobCode: jobToPrice.Code,
            PaymarketId: jobToPrice.PaymarketId
          }).pipe(
            map(response => new fromJobsToPriceActions.GetMatchJobCutsSuccess({
              JobMatchCuts: response.JobMatchCuts,
              JobId: jobToPrice.Id
            })),
            catchError(() => of(new fromJobsToPriceActions.GetMatchJobCutsError(jobToPrice)))
          );
        }
      )
    );

  @Effect()
  getPricingMatches$: Observable<Action> = this.actions$.pipe(
    ofType(fromJobsToPriceActions.GET_PRICING_MATCHES),
    switchMap((action: any) => {
      return this.jobsApiService.getPricingCuts({
        PricingId: action.pricingId,
        SearchContextRate: action.rate
      }).pipe(
        map(response => new fromJobsToPriceActions.GetMatchJobCutsSuccess({
          JobMatchCuts: response,
          JobId: action.pricingId
        }))
        // TODO: The corresponding catchError condition for the project implementation of MMM needs the entire JobToPrice object in the payload...why?
      );
    })
  );

    constructor(
      private actions$: Actions,
      private surveySearchApiService: SurveySearchApiService,
      private jobsApiService: JobsApiService,
      private store: Store<fromMultiMatchReducer.State>
  ) {}
}
