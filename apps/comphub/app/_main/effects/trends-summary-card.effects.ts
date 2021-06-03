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
import { UpsertPeerTrendRequest } from 'libs/models/peer/requests';
import { PeerTrendsApiService } from 'libs/data/payfactors-api/peer/peer-trends-api.service';

@Injectable()
export class TrendsSummaryCardEffects {
  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private exchangeExplorerContextService: ExchangeExplorerContextService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService,
    private peerTrendApiService: PeerTrendsApiService
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
      const lowerDate = new Date();
      lowerDate.setFullYear(lowerDate.getFullYear() - 3);

      const request: HistoricalExchangeDataSearchRequest = {
        ...data.exchangeExplorerFilterContext,
        From: lowerDate,
        To: new Date(),
        CalendarInterval: CalendarInterval.Month
      };

      return this.exchangeDataSearchApiService.getHistoricalTrends(request).pipe(
        map((response) => {
          return new fromTrendsSummaryCardActions.GetPeerTrendsSuccess(response.PricingHistoryCollection);
        }),
        catchError(() => of(new fromTrendsSummaryCardActions.GetPeerTrendsError()))
      );
    }));

  @Effect({dispatch: true})
  savePeerTrend$ = this.actions$.pipe(
    ofType(fromTrendsSummaryCardActions.SAVE_PEER_TREND),
    map((action: fromTrendsSummaryCardActions.SavePeerTrend) => action),
    withLatestFrom(
      this.exchangeExplorerContextService.selectFilterContext(),
      (action, exchangeExplorerFilterContext) => ({action, exchangeExplorerFilterContext})
    ),
    switchMap((data) => {
      const actions = [];
      const request: UpsertPeerTrendRequest = {
        PeerTrendDetails: data.action.payload,
        ExchangeDataSearchRequest: data.exchangeExplorerFilterContext
      };
      return this.peerTrendApiService.upsertPeerTrend(request).pipe(
        switchMap((response) => {
          actions.push(new fromTrendsSummaryCardActions.SavePeerTrendSuccess());
          actions.push(new fromTrendsSummaryCardActions.ToggleSaveTrendModal({displayModal: false}));
          return actions;
        }),
        catchError( () => of(new fromTrendsSummaryCardActions.SavePeerTrendError()))
      );
    })
  );
}
