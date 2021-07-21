import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';

import { withLatestFrom, map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { DataCutSummaryApiService } from 'libs/data/payfactors-api/pricing';

import * as fromNationalAverageReducer from '../reducers';
import * as fromNationalAverageActions from '../actions';

@Injectable()
export class NationalAverageEffects {
  @Effect()
  getNationalAveragesForExchangeJobs$ = this.actions$
    .pipe(
      ofType(fromNationalAverageActions.GET_NATIONAL_AVERAGES_FOR_EXCHANGE_JOBS),
      withLatestFrom(
        this.store.pipe(select(fromNationalAverageReducer.getExchangeJobNationalAverages)),
        (action: fromNationalAverageActions.GetNationalAveragesForExchangeJobs, exchangeJobNationalAverages) =>
        ({action, exchangeJobNationalAverages})
      ),
      switchMap((data: any) => {
          const exchangeJobIds = data.action.exchangeJobIds.filter(jobId => !data.exchangeJobNationalAverages.some(avg => avg.ExchangeJobId == jobId));
          if (exchangeJobIds.length > 0) {
            return this.dataCutSummaryApiService.getNationalAveragesForExchangeJobs(exchangeJobIds)
              .pipe(
                map(response => new fromNationalAverageActions.GetNationalAveragesForExchangeJobsSuccess(response)),
                catchError(() => of(new fromNationalAverageActions.GetNationalAveragesForExchangeJobsError()))
              );
          }
        }
      ));

  constructor (
    private actions$: Actions,
    private dataCutSummaryApiService: DataCutSummaryApiService,
    private store: Store<fromNationalAverageReducer.State>
  ) {}
}
