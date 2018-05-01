import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import { of } from 'rxjs/observable/of';

import { PayMarketApiService, ExchangeDataSearchApiService } from 'libs/data/payfactors-api';
import { ExchangeDataSearchFilter, FilterAggregateGroup } from 'libs/models/peer';

import * as fromFilterSidebarActions from '../actions/filter-sidebar.actions';
import * as fromPeerMapActions from '../actions/map.actions';
import * as fromPeerMapReducers from '../reducers';
import { ExchangeJobPayMarketFilter } from '../../../../models/peer';

@Injectable()
export class FilterSidebarEffects {
  @Effect()
  loadingExchangeJobPayMarketFilter$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.LOADING_EXCHANGE_JOB_PAY_MARKET_FILTER)
    .map((action: fromFilterSidebarActions.LoadingExchangeJobPayMarketFilter) => action.payload)
    .switchMap(payload =>
      this.exchangeDataSearchApiService.getExchangeJobAndPayMarketFilter(payload)
        .map((exchangeJobPayMarketFilter: ExchangeJobPayMarketFilter) => new fromFilterSidebarActions
          .LoadingExchangeJobPayMarketFilterSuccess(exchangeJobPayMarketFilter))
        .catch(() => of(new fromPeerMapActions.LoadPeerMapDataError))
    );

  @Effect()
  loadingExchangeJobPayMarketFilterSuccess$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.LOADING_EXCHANGE_JOB_PAY_MARKET_FILTER_SUCCESS)
    .map((action: fromFilterSidebarActions.LoadingExchangeJobPayMarketFilterSuccess) => action.payload)
    .switchMap(() => of(new fromPeerMapActions.LoadPeerMapData()));

  @Effect()
  loadPayMarketInformation$ = this.actions$
    .ofType(fromFilterSidebarActions.LOAD_PAYMARKET_INFORMATION)
    .map((action: fromFilterSidebarActions.LoadPayMarketInformation) => action.payload)
    .switchMap((payload) => {
      return this.payMarketApiService.get(payload)
      .map((response) => new fromFilterSidebarActions.LoadPayMarketInformationSuccess(response));
    });

  @Effect()
  loadFilterAggregates$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.LOADING_FILTER_AGGREGATES)
    .withLatestFrom(
      this.peerMapStore.select(fromPeerMapReducers.getExchangeDataCutRequestData),
      (action, exchangeDataCutRequestData) => exchangeDataCutRequestData)
    .switchMap((filter: ExchangeDataSearchFilter) =>
      this.exchangeDataSearchApiService.getFilterAggregates(filter)
        .map((aggregateGroups: FilterAggregateGroup[]) => new fromFilterSidebarActions.LoadingFilterAggregatesSuccess(aggregateGroups))
        .catch(() => of(new fromFilterSidebarActions.LoadingFilterAggregatesError()))
    );

  @Effect()
  aggregateSelected$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.TOGGLE_AGGREGATE_SELECTED)
    .switchMap(() => of(new fromPeerMapActions.LoadPeerMapData));

  @Effect()
  limitToPayMarketToggled$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.TOGGLE_LIMIT_TO_PAYMARKET)
    .mergeMap(() => [
      new fromFilterSidebarActions.ClearAllSelections(),
      new fromPeerMapActions.LoadPeerMapData(),
      new fromFilterSidebarActions.LoadingFilterAggregates()
    ]);

  @Effect()
  clearGroupSelections$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.CLEAR_GROUP_SELECTIONS)
    .switchMap(() => of(new fromPeerMapActions.LoadPeerMapData));

  constructor(
    private actions$: Actions,
    private peerMapStore: Store<fromPeerMapReducers.State>,
    private payMarketApiService: PayMarketApiService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService
  ) {}
}
