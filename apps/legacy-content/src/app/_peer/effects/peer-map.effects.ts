import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';

import { ExchangeDataSearchApiService } from 'libs/data/payfactors-api/peer';
import { ExchangeMapResponse, ExchangeMapFilter } from 'libs/models/peer';

import * as fromPeerMapActions from '../actions/peer-map.actions';
import * as fromPeerDataReducers from '../reducers';

@Injectable()
export class PeerMapEffects {

  @Effect()
  loadInitialMapFilter$: Observable<Action> = this.actions$
    .ofType(fromPeerMapActions.LOADING_INITIAL_PEER_MAP_FILTER)
    .map((action: fromPeerMapActions.LoadingInitialPeerMapFilter) => action.payload)
    .switchMap(payload =>
      this.exchangeDataSearchApiService.getInitialMapFilter(payload)
        .concatMap((exchangeMapFilter: ExchangeMapFilter) => {
          return [
            new fromPeerMapActions.LoadingInitialPeerMapFilterSuccess(exchangeMapFilter),
            new fromPeerMapActions.LoadingPeerMap
          ];
        })
        .catch(() => of(new fromPeerMapActions.LoadingPeerMap))
    );

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

  constructor(
    private actions$: Actions,
    private store: Store<fromPeerDataReducers.State>,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService
  ) {}
}
