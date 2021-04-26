
import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import * as fromComphubMainReducer from '../reducers';
import * as fromTrendsSummaryCardActions from '../actions/trends-summary-card.actions';

import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api/search/peer';
import { CalendarInterval, HistoricalExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';

@Injectable()
export class TrendsSummaryCardEffects {

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService
  ) {}

  @Effect({dispatch: true})
  getPeerTrends$ = this.actions$.pipe(
    ofType(fromTrendsSummaryCardActions.GET_PEER_TRENDS),
    map((action: fromTrendsSummaryCardActions.GetPeerTrends) => action),
    withLatestFrom(
      this.exchangeExplorerContextService.selectFilterContext(),
      this.store.select(fromComphubMainReducer.getSelectedExchangeJobs),
      (action, exchangeExplorerFilterContext, exchangeJobs) => ({action, exchangeExplorerFilterContext, exchangeJobs})
    ),
    switchMap( (data) => {
      const actions = [];

      const lowerDate = new Date();
      lowerDate.setFullYear(lowerDate.getFullYear() - 3);

      const request: HistoricalExchangeDataSearchRequest = {
        ...data.exchangeExplorerFilterContext,
        From: lowerDate,
        To: new Date(),
        CalendarInterval: CalendarInterval.Month
      }

      return this.exchangeDataSearchApiService.getHistoricalTrends(request).pipe(
        map((response) => {
          return new fromTrendsSummaryCardActions.GetPeerTrendsSuccess(response.PricingHistoryCollection);
        }),
        catchError(() => of(new fromTrendsSummaryCardActions.GetPeerTrendsError()))
      );

    }));

}
