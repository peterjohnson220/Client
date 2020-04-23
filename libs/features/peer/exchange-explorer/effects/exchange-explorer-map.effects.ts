import { Injectable } from '@angular/core';

import { Action, select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { filter, mergeMap, take, withLatestFrom } from 'rxjs/operators';

import * as fromExchangeExplorerMapActions from '../actions/map.actions';
import * as fromExchangeSearchResultsActions from '../actions/exchange-search-results.actions';
import * as fromExchangeExplorerReducer from '../reducers';
import * as fromExchangeScopeActions from '../actions/exchange-scope.actions';

@Injectable()
export class ExchangeExplorerMapEffects {
  @Effect()
  moveEnd$: Observable<Action> = this.actions$.pipe(
    ofType(fromExchangeExplorerMapActions.MOVE_END),
    withLatestFrom(
      this.store.pipe(select(fromExchangeExplorerReducer.getHasAppliedFilterContext)),
      this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapApplyingScope)),
      this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapAutoZooming)),
      this.store.pipe(select(fromExchangeExplorerReducer.getPeerMapInitialZoomComplete)),
      this.store.pipe(select(fromExchangeExplorerReducer.getExchangeScopesLoadingByExchange)),
      this.store.pipe(select(fromExchangeExplorerReducer.getFilterContextHasDefaultScope)),
      (
        action: fromExchangeExplorerMapActions.MoveEnd,
        hasAppliedFilterContext,
        applyingScope,
        autoZooming,
        initialZoomComplete,
        exchangeScopesLoadingByExchange,
        hasDefaultScope) => ({
          action,
          hasAppliedFilterContext,
          applyingScope,
          autoZooming,
          initialZoomComplete,
          exchangeScopesLoadingByExchange,
          hasDefaultScope
        })
    ),
    mergeMap((data) => {
      if (data.exchangeScopesLoadingByExchange) {
        // If the exchange scopes haven't been loaded, wait for them to be loaded and then re-dispatch the MoveEnd event.
        // This way we know if the user's default scope still exists before applying it [JP]
        this.store.pipe(select(fromExchangeExplorerReducer.getExchangeScopesLoadingByExchange), filter(loading => !loading), take(1))
          .subscribe(() => this.store.dispatch(new fromExchangeExplorerMapActions.MoveEnd(data.action.payload)));
        return [];
      }
      if (!data.hasAppliedFilterContext || data.applyingScope || data.autoZooming) {
          return [];
      }
      if (data.hasDefaultScope) {
        return [
          new fromExchangeScopeActions.LoadExchangeScopeDetails()
        ];
      }

      return [
        new fromExchangeExplorerMapActions.UpdatePeerMapFilterBounds(data.action.payload),
        new fromExchangeSearchResultsActions.GetExchangeDataResults({isMapMove: true})
      ];
    }),
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromExchangeExplorerReducer.State>
  ) {}
}
