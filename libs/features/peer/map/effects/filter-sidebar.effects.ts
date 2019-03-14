import { Injectable } from '@angular/core';

import { Action, select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap, map, withLatestFrom, tap } from 'rxjs/operators';

import { PayMarketApiService, ExchangeDataSearchApiService } from 'libs/data/payfactors-api';
import { FilterAggregateGroup, SystemFilter, ExchangeScopeItem } from 'libs/models/peer';

import * as fromFilterSidebarActions from '../actions/filter-sidebar.actions';
import * as fromPeerMapActions from '../actions/map.actions';
import * as fromPeerMapReducers from '../reducers';

@Injectable()
export class FilterSidebarEffects {
  @Effect()
  loadingSystemFilter$ = this.actions$.pipe(
      ofType(fromFilterSidebarActions.LOAD_SYSTEM_FILTER),
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
  loadingSystemFilterSuccess$ = this.actions$.pipe(
      ofType(fromFilterSidebarActions.LOAD_SYSTEM_FILTER_SUCCESS),
      map((action: fromFilterSidebarActions.LoadSystemFilterSuccess) => action.payload),
      switchMap(() => of(new fromPeerMapActions.LoadPeerMapData()))
    );

  @Effect()
  loadPayMarketInformation$ = this.actions$.pipe(
      ofType(fromFilterSidebarActions.LOAD_PAYMARKET_INFORMATION),
      map((action: fromFilterSidebarActions.LoadPayMarketInformation) => action.payload),
      switchMap((payload) => {
        return this.payMarketApiService.get(payload).pipe(
          map((response) => new fromFilterSidebarActions.LoadPayMarketInformationSuccess(response))
        );
      })
    );

  @Effect()
  loadFilterAggregates$ = this.actions$.pipe(
      ofType(fromFilterSidebarActions.LOAD_FILTER_AGGREGATES),
      map((action: fromFilterSidebarActions.LoadFilterAggregates) => action.payload),
      withLatestFrom(
        this.peerMapStore.pipe(select(fromPeerMapReducers.getExchangeDataCutRequestData)),
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
  aggregateSelected$ = this.actions$.pipe(
      ofType(fromFilterSidebarActions.TOGGLE_AGGREGATE_SELECTED),
      mergeMap(() => [
        new fromPeerMapActions.LoadPeerMapData,
        new fromFilterSidebarActions.LoadFilterAggregates(false)
      ])
    );

  @Effect()
  limitToPayMarketToggled$ = this.actions$.pipe(
      ofType(fromFilterSidebarActions.TOGGLE_LIMIT_TO_PAYMARKET),
      withLatestFrom(
        this.peerMapStore.pipe(select(fromPeerMapReducers.getPeerFilterScopeSelection)),
        (action, scopeSelection: ExchangeScopeItem) => !!scopeSelection
      ),
      tap(() => this.peerMapStore.dispatch(new fromPeerMapActions.ClearMapFilterBounds())),
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
  clearAllSelections$ = this.actions$.pipe(
      ofType(fromFilterSidebarActions.CLEAR_ALL_SELECTIONS),
      mergeMap(() => [
        new fromPeerMapActions.LoadPeerMapData(),
        new fromFilterSidebarActions.LoadFilterAggregates()
      ])
    );

  @Effect()
  clearGroupSelections$ = this.actions$.pipe(
      ofType(fromFilterSidebarActions.TOGGLE_GROUP_SELECTIONS),
      mergeMap(() => [
        new fromPeerMapActions.LoadPeerMapData,
        new fromFilterSidebarActions.LoadFilterAggregates()
      ])
    );

  @Effect()
  includeUntaggedEmployeesToggled$ = this.actions$.pipe(
    ofType(fromFilterSidebarActions.TOGGLE_INCLUDE_UNTAGGED_EMPLOYEES),
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
