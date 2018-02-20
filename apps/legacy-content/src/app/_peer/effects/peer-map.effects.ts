import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/mergeMap';

import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api/peer';
import { ExchangeMapResponse, ExchangeMapFilter } from 'libs/models/peer';

import * as fromPeerMapActions from '../actions/peer-map.actions';
import * as fromPeerFiltersActions from '../actions/peer-filters.actions';
import * as fromPeerDataReducers from '../reducers';

@Injectable()
export class PeerMapEffects {
  @Effect()
  loadInitialMapFilter$: Observable<Action> = this.actions$
    .ofType(fromPeerMapActions.LOADING_INITIAL_PEER_MAP_FILTER)
    .map((action: fromPeerMapActions.LoadingInitialPeerMapFilter) => action.payload)
    .switchMap(payload =>
      this.exchangeDataSearchApiService.getInitialMapFilter(payload)
        .map((exchangeMapFilter: ExchangeMapFilter) => new fromPeerMapActions
          .LoadingInitialPeerMapFilterSuccess(exchangeMapFilter))
        .catch(() => of(new fromPeerMapActions.LoadingPeerMapError))
    );

  // Asynchronously load the map and load the filters after loading the initial filters
  @Effect()
  loadingInitialMapFilterSuccess$: Observable<Action> = this.actions$
    .ofType(fromPeerMapActions.LOADING_INITIAL_PEER_MAP_FILTER_SUCCESS)
    .map((action: fromPeerMapActions.LoadingInitialPeerMapFilterSuccess) => action.payload)
    .mergeMap(() => [new fromPeerMapActions.LoadingPeerMap, new fromPeerFiltersActions.LoadingPeerFilters]);

  @Effect()
  loadPeerMap$: Observable<Action> = this.actions$
    .ofType(fromPeerMapActions.LOADING_PEER_MAP)
    .withLatestFrom(this.store.select(fromPeerDataReducers.getPeerMapFilter), (action, filter) => filter)
    .switchMap((payload: ExchangeMapFilter) =>
      this.exchangeDataSearchApiService.getMapData(payload)
        .map((exchangeMapResponse: ExchangeMapResponse) => new fromPeerMapActions
          .LoadingPeerMapSuccess(exchangeMapResponse))
        .catch(() => of(new fromPeerMapActions.LoadingPeerMapError()))
    );

  @Effect()
  updateFilterBounds$: Observable<Action> = this.actions$
    .ofType(fromPeerMapActions.UPDATE_PEER_MAP_FILTER_BOUNDS)
    .switchMap(() => of(new fromPeerMapActions.LoadingPeerMap));

  @Effect()
  loadPeerFilters$: Observable<Action> = this.actions$
    .ofType(fromPeerFiltersActions.LOADING_PEER_FILTERS)
    .withLatestFrom(this.store.select(fromPeerDataReducers.getPeerMapFilter), (action, filter) => filter)
    .switchMap((filter: ExchangeMapFilter) =>
      this.exchangeDataSearchApiService.getMapFilters(filter)
        .map((exchangeFiltersResponse: any) => new fromPeerFiltersActions.LoadingPeerFiltersSuccess({
          response: exchangeFiltersResponse,
          filter: filter
        }))
        .catch(() => of(new fromPeerFiltersActions.LoadingPeerFiltersError))
    );

  @Effect()
  updatePeerMapFilter$: Observable<Action> = this.actions$
    .ofType(fromPeerMapActions.UPDATE_PEER_MAP_FILTER)
    .switchMap(() => of(new fromPeerMapActions.LoadingPeerMap));

  constructor(
    private actions$: Actions,
    private store: Store<fromPeerDataReducers.State>,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService
  ) {}
}
