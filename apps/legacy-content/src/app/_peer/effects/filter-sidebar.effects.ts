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
import * as fromPeerDataReducers from '../reducers';

@Injectable()
export class FilterSidebarEffects {

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
      this.store.select(fromPeerDataReducers.getExchangeDataCutRequestData),
      (action, exchangeDataCutRequestData) => exchangeDataCutRequestData)
    .switchMap((filter: ExchangeDataSearchFilter) =>
      this.exchangeDataSearchApiService.getFilterAggregates(filter)
        .map((aggregateGroups: FilterAggregateGroup[]) => new fromFilterSidebarActions.LoadingFilterAggregatesSuccess(aggregateGroups))
        .catch(() => of(new fromFilterSidebarActions.LoadingFilterAggregatesError()))
    );

  @Effect()
  aggregateSelected$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.TOGGLE_AGGREGATE_SELECTED)
    .switchMap(() => of(new fromPeerMapActions.LoadingPeerMap));

  @Effect()
  limitToPayMarketToggled$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.TOGGLE_LIMIT_TO_PAYMARKET)
    .mergeMap(() => [
      new fromFilterSidebarActions.ClearAllSelections(),
      new fromPeerMapActions.LoadingPeerMap(),
      new fromFilterSidebarActions.LoadingFilterAggregates()
    ]);

  @Effect()
  clearGroupSelections$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.CLEAR_GROUP_SELECTIONS)
    .switchMap(() => of(new fromPeerMapActions.LoadingPeerMap));

  constructor(
    private actions$: Actions,
    private store: Store<fromPeerDataReducers.State>,
    private payMarketApiService: PayMarketApiService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService
  ) {}
}
