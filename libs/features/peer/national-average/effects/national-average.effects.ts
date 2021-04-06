import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map,  switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromNationalAverageActions from 'libs/features/peer/national-average/actions/national-average.actions';
import { DataCutSummaryApiService } from 'libs/data/payfactors-api/pricing';

@Injectable()
export class NationalAverageEffects {

  @Effect()
  getNationalAveragesForExchangeJobs$ = this.actions$
    .pipe(
      ofType(fromNationalAverageActions.GET_NATIONAL_AVERAGES_FOR_EXCHANGE_JOBS),
      map((action: fromNationalAverageActions.GetNationalAveragesForExchangeJobs) => action.exchangeJobIds),
      switchMap((exchangeJobIds) => {
          return this.dataCutSummaryApiService.getNationalAveragesForExchangeJobs(exchangeJobIds)
            .pipe(
              map(response => new fromNationalAverageActions.GetNationalAveragesForExchangeJobsSuccess(response)),
              catchError(() => of(new fromNationalAverageActions.GetNationalAveragesForExchangeJobsError()))
            );
        }
      ));

  constructor (
    private actions$: Actions,
    private dataCutSummaryApiService: DataCutSummaryApiService
  ) {}
}
