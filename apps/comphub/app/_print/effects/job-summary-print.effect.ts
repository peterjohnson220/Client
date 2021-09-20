import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ComphubCrowdSourcedApiService } from 'libs/data/payfactors-api/comphub';

import * as fromJobSummaryPrintActions from '../actions/job-summary-print.actions';
import { PayfactorsApiModelMapper } from '../../_shared/helpers';

@Injectable()
export class JobSummaryPrintEffect {

  @Effect()
  getJobSummaryPrintData$ = this.actions$
    .pipe(
      ofType(fromJobSummaryPrintActions.GET_JOB_SUMMARY_PRINT_DATA),
      switchMap((action: fromJobSummaryPrintActions.GetJobSummaryPrintData) => {
          return this.comphubCSDApiService.getJobSummaryPrintData(action.payload).pipe(
            mergeMap((response) => {
              const actions = [];
              const jobSummaryPrintData = PayfactorsApiModelMapper.mapGetJobSummaryPrintDataResponseToJobSummaryPrintData(response);
              actions.push(new fromJobSummaryPrintActions.GetJobSummaryPrintDataSuccess(jobSummaryPrintData));
              return actions;
            }),
            catchError(() => of(new fromJobSummaryPrintActions.GetJobSummaryPrintDataError()))
          );
        }
      ));

  constructor(
    private actions$: Actions,
    private comphubCSDApiService: ComphubCrowdSourcedApiService
  ) {}
}
