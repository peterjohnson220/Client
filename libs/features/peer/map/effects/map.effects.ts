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

import * as fromFilterSidebarActions from '../actions/filter-sidebar.actions';
import * as fromPeerMapActions from '../actions/map.actions';
import * as fromPeerMapReducers from '../reducers';

@Injectable()
export class MapEffects {
  @Effect()
  loadPeerMap$: Observable<Action> = this.actions$
    .ofType(fromPeerMapActions.LOAD_PEER_MAP_DATA)
    .withLatestFrom(
        this.peerMapStore.select(fromPeerMapReducers.getExchangeDataCutRequestData),
        (action, exchangeDataCutRequestData) => exchangeDataCutRequestData)
    .switchMap((payload: ExchangeDataSearchFilter) =>
      this.exchangeDataSearchApiService.getMapData(payload)
        .map((exchangeMapResponse: ExchangeMapResponse) => new fromPeerMapActions
          .LoadPeerMapDataSuccess(exchangeMapResponse))
        .catch(() => of(new fromPeerMapActions.LoadPeerMapDataError()))
    );

  @Effect()
  updateFilterBounds$: Observable<Action> = this.actions$
    .ofType(fromPeerMapActions.UPDATE_PEER_MAP_FILTER_BOUNDS)
    .mergeMap(() => [
      new fromPeerMapActions.LoadPeerMapData,
      new fromFilterSidebarActions.LoadFilterAggregates()
    ]);

  @Effect()
  initialMapMoveComplete$: Observable<Action> = this.actions$
    .ofType(fromPeerMapActions.INITIAL_MAP_MOVE_COMPLETE)
    .mergeMap(() => [
      new fromPeerMapActions.LoadPeerMapData,
      new fromFilterSidebarActions.LoadFilterAggregates()
    ]);

  constructor(
    private actions$: Actions,
    private peerMapStore: Store<fromPeerMapReducers.State>,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService
  ) {}
}
