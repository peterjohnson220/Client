import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { map, switchMap, catchError, withLatestFrom } from 'rxjs/operators';

import { PricingApiService } from 'libs/data/payfactors-api';

import * as fromPricingHistoryChartActions from '../actions';
import * as fromPricingHistoryChartReducer from '../reducers';


@Injectable()
export class PricingHistoryChartEffects {

  constructor(
    private actions$: Actions,
    private pricingApiService: PricingApiService,
    private store: Store<fromPricingHistoryChartReducer.State>,
  ) { }

  @Effect()
  loadPricedPayMarkets$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPricingHistoryChartActions.LOAD_PRICED_PAYMARKETS),
      withLatestFrom(
        this.store.pipe(select(fromPricingHistoryChartReducer.getJobId)),
        (action: fromPricingHistoryChartActions.LoadPricedPayMarkets, jobId) =>
          ({ action, jobId })
      ),
      switchMap(data =>
        this.pricingApiService.getPricedPaymarkets(data.jobId).pipe(
          map((pricedPayMarkets) => new fromPricingHistoryChartActions.LoadPricedPayMarketsSuccess(pricedPayMarkets)),
          catchError(() => of(new fromPricingHistoryChartActions.LoadPricedPayMarketsError('There was an error loading your paymarket information')))
        )
      )
    );
}
