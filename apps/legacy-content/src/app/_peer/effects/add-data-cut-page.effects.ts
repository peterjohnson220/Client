import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';

import { ExchangeCompanyApiService, ExchangeDataSearchApiService } from 'libs/data/payfactors-api/peer';
import { WindowCommunicationService } from 'libs/core/services';
import { ExchangeJobPayMarketFilter } from 'libs/models/peer';

import * as fromAddDataCutPageActions from '../actions/add-data-cut-page.actions';
import * as fromPeerMapActions from '../actions/map.actions';
import * as fromFilterSidebarActions from '../actions/filter-sidebar.actions';
import * as fromPeerDataReducers from '../reducers';

@Injectable()
export class AddDataCutPageEffects {

  @Effect()
  loadingExchangeJobPayMarketFilter$: Observable<Action> = this.actions$
    .ofType(fromAddDataCutPageActions.LOADING_EXCHANGE_JOB_PAY_MARKET_FILTER)
    .map((action: fromAddDataCutPageActions.LoadingExchangeJobPayMarketFilter) => action.payload)
    .switchMap(payload =>
      this.exchangeDataSearchApiService.getExchangeJobAndPayMarketFilter(payload)
        .map((exchangeJobPayMarketFilter: ExchangeJobPayMarketFilter) => new fromAddDataCutPageActions
          .LoadingExchangeJobPayMarketFilterSuccess(exchangeJobPayMarketFilter))
        .catch(() => of(new fromPeerMapActions.LoadingPeerMapError))
    );

  @Effect()
  loadingExchangeJobPayMarketFilterSuccess$: Observable<Action> = this.actions$
    .ofType(fromAddDataCutPageActions.LOADING_EXCHANGE_JOB_PAY_MARKET_FILTER_SUCCESS)
    .map((action: fromAddDataCutPageActions.LoadingExchangeJobPayMarketFilterSuccess) => action.payload)
    .mergeMap(() => [new fromPeerMapActions.LoadingPeerMap, new fromFilterSidebarActions.LoadingFilterAggregates()]);

  @Effect()
  addingDataCut$ = this.actions$
    .ofType(fromAddDataCutPageActions.ADDING_DATA_CUT)
    .map((action: fromAddDataCutPageActions.AddingDataCut) => action.payload)
    .withLatestFrom(
      this.store.select(fromPeerDataReducers.getExchangeDataCutRequestData),
      (action, exchangeDataCutRequestData) => ({action, exchangeDataCutRequestData}))
    .switchMap((latest) => {
      return this.exchangeCompanyApiService.addDataCut({
        CompanyJobId: latest.action.CompanyJobId,
        CompanyPayMarketId: latest.action.CompanyPayMarketId,
        UserSessionId: latest.action.UserSessionId,
        Filter: latest.exchangeDataCutRequestData
      })
      .map(() => new fromAddDataCutPageActions.AddingDataCutSuccess())
      .catch(() => of(new fromAddDataCutPageActions.AddingDataCutError()));
    });

  @Effect({ dispatch: false })
  addingDataCutSuccess$ = this.actions$
    .ofType(fromAddDataCutPageActions.ADDING_DATA_CUT_SUCCESS)
    .do((action: fromAddDataCutPageActions.AddingDataCutSuccess) => {
      this.windowCommunicationService.postMessage(action.type);
    });

  @Effect({ dispatch: false })
  cancelAddDataCut$ = this.actions$
    .ofType(fromAddDataCutPageActions.CANCEL_ADD_DATA_CUT)
    .do((action: fromAddDataCutPageActions.CancelAddDataCut) => {
      this.windowCommunicationService.postMessage(action.type);
    });

  constructor(
    private actions$: Actions,
    private store: Store<fromPeerDataReducers.State>,
    private exchangeCompanyApiService: ExchangeCompanyApiService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService,
    private windowCommunicationService: WindowCommunicationService
  ) {}
}
