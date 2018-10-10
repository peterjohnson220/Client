import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs/index';

import { SurveySearchApiService } from 'libs/data/payfactors-api';

import { mapMatchedSurveyJobToJobsToPrice } from '../helpers';
import * as fromJobsToPriceActions from '../actions/jobs-to-price.actions';



@Injectable()
export class JobsToPriceEffects {

  @Effect()
  getJobsToPrice$ = this.actions$
    .ofType(fromJobsToPriceActions.GET_JOBS_TO_PRICE)
    .pipe(
      map((action: fromJobsToPriceActions.GetJobsToPrice) => action.payload),
      switchMap((projectContext) => {
        return this.surveySearchApiService.getJobsToPrice({
          JobMatchIds: projectContext.JobValues.map(x => Number(x)),
          ProjectId: projectContext.ProjectId
        }).pipe(
            map(response => new fromJobsToPriceActions.GetJobsToPriceSuccess(mapMatchedSurveyJobToJobsToPrice(response))),
            catchError(error => of(new fromJobsToPriceActions.GetJobsToPriceError()))
          );
        }
      )
    );

    constructor(
      private actions$: Actions,
      private surveySearchApiService: SurveySearchApiService
  ) {}
}
