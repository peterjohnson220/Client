import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, mergeMap, withLatestFrom } from 'rxjs/operators';

import { ExchangeDataSearchApiService, AppEnvironmentApiService } from 'libs/data/payfactors-api/';
import { ExchangeMapResponse, ExchangeDataSearchFilter, GenericKeyValue } from 'libs/models/';

import * as fromFilterSidebarActions from '../actions/filter-sidebar.actions';
import * as fromPeerMapActions from '../actions/map.actions';
import * as fromPeerMapReducers from '../reducers';

@Injectable()
export class MapEffects {
  @Effect()
  loadPeerMap$: Observable<Action> = this.actions$.pipe(
      ofType(fromPeerMapActions.LOAD_PEER_MAP_DATA),
      withLatestFrom(
          this.peerMapStore.select(fromPeerMapReducers.getExchangeDataCutRequestData),
          (action, exchangeDataCutRequestData) => exchangeDataCutRequestData),
      switchMap((payload: ExchangeDataSearchFilter) =>
        this.exchangeDataSearchApiService.getMapData(payload).pipe(
          map((exchangeMapResponse: ExchangeMapResponse) => new fromPeerMapActions
            .LoadPeerMapDataSuccess(exchangeMapResponse)),
          catchError(() => of(new fromPeerMapActions.LoadPeerMapDataError()))
        )
      )
    );

  @Effect()
  updateFilterBounds$: Observable<Action> = this.actions$.pipe(
      ofType(fromPeerMapActions.UPDATE_PEER_MAP_FILTER_BOUNDS),
      mergeMap(() => [
        new fromPeerMapActions.LoadPeerMapData,
        new fromFilterSidebarActions.LoadFilterAggregates()
      ])
    );

  @Effect()
  initialMapMoveComplete$: Observable<Action> = this.actions$.pipe(
      ofType(fromPeerMapActions.INITIAL_MAP_MOVE_COMPLETE),
      mergeMap(() => [
        new fromPeerMapActions.LoadPeerMapData,
        new fromFilterSidebarActions.LoadFilterAggregates()
      ])
    );

  @Effect()
  loadZoomPrecisionDictionary$: Observable<Action> = this.actions$.pipe(
      ofType(fromPeerMapActions.LOAD_ZOOM_PRECISION_DICTIONARY),
      switchMap(() => this.appEnvironmentApiService.getMapboxPrecision().pipe(
        map((response: GenericKeyValue<number, number>[]) => new fromPeerMapActions.LoadZoomPrecisionDictionarySuccess(response)),
        catchError(() => of(new fromPeerMapActions.LoadZoomPrecisionDictionaryError))
      ))
    );

  constructor(
    private actions$: Actions,
    private peerMapStore: Store<fromPeerMapReducers.State>,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService,
    private appEnvironmentApiService: AppEnvironmentApiService
  ) {}
}
