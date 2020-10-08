import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';

import { ComphubApiService } from 'libs/data/payfactors-api/comphub';
import { ExchangeExplorerContextService } from 'libs/features/peer/exchange-explorer/services';
import { QuickPriceExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer';

import * as fromComphubMainReducer from '../reducers';
import * as fromMarketsCardActions from '../actions/markets-card.actions';
import * as fromDataCardActions from '../actions/data-card.actions';
import * as fromComphubPageActions from '../actions/comphub-page.actions';
import { ComphubPages } from '../data';

@Injectable()
export class DataCardEffects {

  @Effect()
  getPeerQuickPriceData$ = this.actions$
    .pipe(
      ofType(fromDataCardActions.GET_PEER_QUICK_PRICE_DATA),
      map((action: fromDataCardActions.GetPeerQuickPriceData) => action),
      withLatestFrom(
        this.exchangeExplorerContextService.selectFilterContext(),
        this.store.select(fromComphubMainReducer.getSelectedPaymarket),
        (action, exchangeExplorerFilterContext, payMarket) => ({action, exchangeExplorerFilterContext, payMarket})
      ),
      switchMap((latest) => {
        const request: QuickPriceExchangeDataSearchRequest = {
          ...latest.exchangeExplorerFilterContext,
          ViewOnly: false,
          CompanyPayMarketId: latest.payMarket?.CompanyPayMarketId,
          CountryCode: latest.payMarket?.CountryCode
        };
        return this.comphubApiService.getPeerQuickPriceData(request)
          .pipe(
            mergeMap((response) => {
              return [
                new fromDataCardActions.GetPeerQuickPriceDataSuccess(),
                new fromComphubPageActions.SetSelectedJobData(response.JobData),
                new fromComphubPageActions.AddAccessiblePages([ComphubPages.Summary])
              ];
              }),
              catchError(() => of(new fromDataCardActions.GetPeerQuickPriceDataError()))
          );
      })
  );

  @Effect()
  setMarketDataChange$ = this.actions$
  .pipe(
    ofType(
      fromMarketsCardActions.SET_SELECTED_PAYMARKET
    ),
    map(() => new fromDataCardActions.SetMarketDataChange(true))
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromComphubMainReducer.State>,
    private comphubApiService: ComphubApiService,
    private exchangeExplorerContextService: ExchangeExplorerContextService
  ) {}
}
