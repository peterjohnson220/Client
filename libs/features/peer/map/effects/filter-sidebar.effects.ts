import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap, map, withLatestFrom } from 'rxjs/operators';

import { PayMarketApiService, ExchangeDataSearchApiService } from 'libs/data/payfactors-api';
import { ExchangeDataSearchFilter, FilterAggregateGroup } from 'libs/models/peer';

import * as fromFilterSidebarActions from '../actions/filter-sidebar.actions';
import * as fromPeerMapActions from '../actions/map.actions';
import * as fromPeerMapReducers from '../reducers';
import { SystemFilter, ExchangeScopeItem } from '../../../../models/peer';

@Injectable()
export class FilterSidebarEffects {
  @Effect()
  loadingSystemFilter$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.LOAD_SYSTEM_FILTER).pipe(
      map((action: fromFilterSidebarActions.LoadSystemFilter) => action.payload),
      switchMap(payload =>
        this.exchangeDataSearchApiService.getSystemFilter(payload).pipe(
          map((systemFilter: SystemFilter) => new fromFilterSidebarActions
            .LoadSystemFilterSuccess(systemFilter)),
          catchError(() => of(new fromPeerMapActions.LoadPeerMapDataError))
        )
      )
    );

  @Effect()
  loadingSystemFilterSuccess$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.LOAD_SYSTEM_FILTER_SUCCESS).pipe(
      map((action: fromFilterSidebarActions.LoadSystemFilterSuccess) => action.payload),
      switchMap(() => of(new fromPeerMapActions.LoadPeerMapData()))
    );

  @Effect()
  loadPayMarketInformation$ = this.actions$
    .ofType(fromFilterSidebarActions.LOAD_PAYMARKET_INFORMATION).pipe(
      map((action: fromFilterSidebarActions.LoadPayMarketInformation) => action.payload),
      switchMap((payload) => {
        return this.payMarketApiService.get(payload).pipe(
          map((response) => new fromFilterSidebarActions.LoadPayMarketInformationSuccess(response))
        );
      })
    );

  @Effect()
  loadFilterAggregates$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.LOAD_FILTER_AGGREGATES).pipe(
      map((action: fromFilterSidebarActions.LoadFilterAggregates) => action.payload),
      withLatestFrom(
        this.peerMapStore.select(fromPeerMapReducers.getExchangeDataCutRequestData),
        (action, exchangeDataCutRequestData) => {
          return {action, exchangeDataCutRequestData};
        }
        ),
      switchMap((results: any) =>
        this.exchangeDataSearchApiService.getFilterAggregates(results.exchangeDataCutRequestData).pipe(
          map((aggregateGroups: FilterAggregateGroup[]) => new fromFilterSidebarActions.LoadFilterAggregatesSuccess(
            {aggregateGroups, shouldReplaceAggs: results.action}
            )
          ),
          catchError(() => of(new fromFilterSidebarActions.LoadFilterAggregatesError()))
        )
      )
    );

  @Effect()
  aggregateSelected$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.TOGGLE_AGGREGATE_SELECTED).pipe(
      mergeMap(() => [
        new fromPeerMapActions.LoadPeerMapData,
        new fromFilterSidebarActions.LoadFilterAggregates(false)
      ])
    );

  @Effect()
  limitToPayMarketToggled$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.TOGGLE_LIMIT_TO_PAYMARKET).pipe(
      withLatestFrom(
        this.peerMapStore.select(fromPeerMapReducers.getPeerFilterScopeSelection),
        (action, scopeSelection: ExchangeScopeItem) => !!scopeSelection
      ),
      mergeMap((scopeSelected: boolean) => {
        let obs;
        // Only clear selections on paymarket toggle if a scope is not selected
        if (scopeSelected) {
          obs = [
            new fromPeerMapActions.LoadPeerMapData(),
            new fromFilterSidebarActions.LoadFilterAggregates()
          ];
        } else {
          obs = [new fromFilterSidebarActions.ClearAllSelections()];
        }

        return obs;
      })
    );

  @Effect()
  clearAllSelections$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.CLEAR_ALL_SELECTIONS).pipe(
      mergeMap(() => [
        new fromPeerMapActions.LoadPeerMapData(),
        new fromFilterSidebarActions.LoadFilterAggregates()
      ])
    );

  @Effect()
  clearGroupSelections$: Observable<Action> = this.actions$
    .ofType(fromFilterSidebarActions.TOGGLE_GROUP_SELECTIONS).pipe(
      mergeMap(() => [
        new fromPeerMapActions.LoadPeerMapData,
        new fromFilterSidebarActions.LoadFilterAggregates()
      ])
    );

  constructor(
    private actions$: Actions,
    private peerMapStore: Store<fromPeerMapReducers.State>,
    private payMarketApiService: PayMarketApiService,
    private exchangeDataSearchApiService: ExchangeDataSearchApiService
  ) {}
}
