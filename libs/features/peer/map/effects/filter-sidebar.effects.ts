import { Injectable } from '@angular/core';

import { Action, select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {catchError, mergeMap, switchMap, map, withLatestFrom, tap, concatMap} from 'rxjs/operators';

import { PayMarketApiService, ExchangeDataSearchApiService } from 'libs/data/payfactors-api';
import { FilterAggregateGroup, SystemFilter, ExchangeScopeItem } from 'libs/models/peer';

import * as fromFilterSidebarActions from '../actions/filter-sidebar.actions';
import * as fromPeerMapActions from '../actions/map.actions';
import * as fromPeerMapReducers from '../reducers';
import * as fromLibsExchangeScopeActions from '../actions/exchange-scope.actions';

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
      switchMap(() => of(new fromPeerMapActions.LoadPeerMapBounds()))
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
  loadAssociatedExchangeJob$ = this.actions$.pipe(
      ofType(fromFilterSidebarActions.LOAD_ASSOCIATED_EXCHANGE_JOBS),
      map((action: fromFilterSidebarActions.LoadAssociatedExchangeJobs) => action.payload),
      switchMap((payload) => {
        return this.exchangeDataSearchApiService.getAssociatedExchangeJobs(payload).pipe(
          concatMap((response) => [
            new fromFilterSidebarActions.LoadAssociatedExchangeJobsSuccess(response),
            new fromLibsExchangeScopeActions.LoadExchangeScopesByJobs()
          ])
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
            new fromPeerMapActions.LoadPeerMapBounds()
          ];
        } else {
           obs = [
             new fromFilterSidebarActions.ClearAllSelections,
             new fromPeerMapActions.LoadPeerMapBounds
            ];
         }

        return obs;
      })
    );

  @Effect()
  setExchangeJobSelection$ = this.actions$.pipe(
    ofType(fromFilterSidebarActions.SET_EXCHANGE_JOB_SELECTION),
    tap(() => this.peerMapStore.dispatch(new fromPeerMapActions.ClearMapFilterBounds())),
    mergeMap(() => {
      return [
        new fromFilterSidebarActions.ClearAllSelections,
        new fromFilterSidebarActions.GetMapData
      ];
    })
  );

  @Effect()
  excludeIndirectJobMatchesToggled$ = this.actions$.pipe(
    ofType(fromFilterSidebarActions.TOGGLE_EXCLUDE_INDIRECT_JOB_MATCHES),
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
          new fromPeerMapActions.LoadPeerMapBounds
        ];
      } else {
        obs = [new fromFilterSidebarActions.ClearAllSelections(),
        new fromPeerMapActions.LoadPeerMapBounds];
      }

      return obs;
    })
  );

  @Effect()
  getMapData$ = this.actions$.pipe(
      ofType(fromFilterSidebarActions.GET_MAP_DATA),
      mergeMap(() => [
        new fromPeerMapActions.LoadPeerMapData,
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
