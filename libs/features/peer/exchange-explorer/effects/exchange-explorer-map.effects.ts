import { Injectable } from '@angular/core';

import { Action, select, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { mergeMap, withLatestFrom } from 'rxjs/operators';

import * as fromExchangeExplorerMapActions from '../actions/map.actions';
import * as fromExchangeSearchResultsActions from '../actions/exchange-search-results.actions';
import * as fromExchangeExplorerReducer from '../reducers';

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
      (
        action: fromExchangeExplorerMapActions.MoveEnd,
        hasAppliedFilterContext,
        applyingScope,
        autoZooming,
        initialZoomComplete) => ({
          action,
          hasAppliedFilterContext,
          applyingScope,
          autoZooming,
          initialZoomComplete
        })
    ),
    mergeMap((data) => {
      if (!data.hasAppliedFilterContext || data.applyingScope || data.autoZooming) {
          return [];
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
