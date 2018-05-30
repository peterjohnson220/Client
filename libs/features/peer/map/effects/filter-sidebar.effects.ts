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
import { SystemFilter } from '../../../../models/peer';

@Injectable()
export class FilterSidebarEffects {
  @Effect()
  loadingSystemFilter$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.LOAD_SYSTEM_FILTER)
    .map((action: fromFilterSidebarActions.LoadSystemFilter) => action.payload)
    .switchMap(payload =>
      this.exchangeDataSearchApiService.getSystemFilter(payload)
        .map((systemFilter: SystemFilter) => new fromFilterSidebarActions
          .LoadSystemFilterSuccess(systemFilter))
        .catch(() => of(new fromPeerMapActions.LoadPeerMapDataError))
    );

  @Effect()
  loadingSystemFilterSuccess$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.LOAD_SYSTEM_FILTER_SUCCESS)
    .map((action: fromFilterSidebarActions.LoadSystemFilterSuccess) => action.payload)
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
    .ofType(fromFilterSidebarActions.LOAD_FILTER_AGGREGATES)
    .withLatestFrom(
      this.peerMapStore.select(fromPeerMapReducers.getExchangeDataCutRequestData),
      (action, exchangeDataCutRequestData) => exchangeDataCutRequestData)
    .switchMap((filter: ExchangeDataSearchFilter) =>
      this.exchangeDataSearchApiService.getFilterAggregates(filter)
        .map((aggregateGroups: FilterAggregateGroup[]) => new fromFilterSidebarActions.LoadFilterAggregatesSuccess(aggregateGroups))
        .catch(() => of(new fromFilterSidebarActions.LoadFilterAggregatesError()))
    );

  @Effect()
  aggregateSelected$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.TOGGLE_AGGREGATE_SELECTED)
    .mergeMap(() => [
      new fromPeerMapActions.LoadPeerMapData,
      new fromFilterSidebarActions.LoadFilterAggregates()
    ]);

  @Effect()
  limitToPayMarketToggled$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.TOGGLE_LIMIT_TO_PAYMARKET)
    .mergeMap(() => [
      new fromFilterSidebarActions.ClearAllSelections()
    ]);

  @Effect()
  clearAllSelections$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.CLEAR_ALL_SELECTIONS)
    .mergeMap(() => [
      new fromPeerMapActions.LoadPeerMapData(),
      new fromFilterSidebarActions.LoadFilterAggregates()
    ]);

  @Effect()
  clearGroupSelections$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.CLEAR_GROUP_SELECTIONS)
    .mergeMap(() => [
      new fromPeerMapActions.LoadPeerMapData,
      new fromFilterSidebarActions.LoadFilterAggregates()
    ]);

  constructor(
    private actions$: Actions,
    private peerMapStore: Store<fromPeerMapReducers.State>,
    private payMarketApiService: PayMarketApiService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService
  ) {}
}
