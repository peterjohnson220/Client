import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { SurveySearchApiService } from 'libs/data/payfactors-api';

import * as fromJobsToPriceActions from '../actions/jobs-to-price.actions';
import { PayfactorsApiModelMapper } from '../helpers';
import * as fromMultiMatchReducer from '../reducers';
import * as fromSurveySearchReducer from '../../survey-search/reducers';
import { SearchContext } from '../../survey-search/models';

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
         projectSearchContext: SearchContext) => ({action, projectSearchContext})),
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

    constructor(
      private actions$: Actions,
      private surveySearchApiService: SurveySearchApiService,
      private store: Store<fromMultiMatchReducer.State>
  ) {}
}
