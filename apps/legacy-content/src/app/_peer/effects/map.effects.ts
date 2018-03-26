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
import { ExchangeMapResponse, ExchangeDataSearchFilter } from 'libs/models/peer';

import * as fromPeerMapActions from '../actions/map.actions';
import * as fromPeerDataReducers from '../reducers';
import * as fromFilterSidebarActions from '../actions/filter-sidebar.actions';

@Injectable()
export class MapEffects {
  @Effect()
  loadPeerMap$: Observable<Action> = this.actions$
    .ofType(fromPeerMapActions.LOADING_PEER_MAP)
    .withLatestFrom(
        this.store.select(fromPeerDataReducers.getExchangeDataCutRequestData),
        (action, exchangeDataCutRequestData) => exchangeDataCutRequestData)
    .switchMap((payload: ExchangeDataSearchFilter) =>
      this.exchangeDataSearchApiService.getMapData(payload)
        .map((exchangeMapResponse: ExchangeMapResponse) => new fromPeerMapActions
          .LoadingPeerMapSuccess(exchangeMapResponse))
        .catch(() => of(new fromPeerMapActions.LoadingPeerMapError()))
    );

  @Effect()
  initialMapMoveComplete$: Observable<Action> = this.actions$
    .ofType(fromPeerMapActions.INITIAL_MAP_MOVE_COMPLETE)
    .switchMap(() => of(new fromFilterSidebarActions.LoadingFilterAggregates()));

  @Effect()
  updateFilterBounds$: Observable<Action> = this.actions$
    .ofType(fromPeerMapActions.UPDATE_PEER_MAP_FILTER_BOUNDS)
    .mergeMap(() => [
      new fromPeerMapActions.LoadingPeerMap,
      new fromFilterSidebarActions.LoadingFilterAggregates()
    ]);

  constructor(
    private actions$: Actions,
    private store: Store<fromPeerDataReducers.State>,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService
  ) {}
}
