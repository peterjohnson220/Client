import { Injectable } from '@angular/core';

import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { PayfactorsSearchApiHelper } from 'libs/features/search/helpers';
import { PayMarketApiService } from 'libs/data/payfactors-api/paymarket';
import * as fromLibsPeerExchangeExplorerScopeActions from 'libs/features/peer/exchange-explorer/actions/exchange-scope.actions';
import * as fromLibsExchangeExplorerReducer from 'libs/features/peer/exchange-explorer/reducers';
import * as fromSearchReducer from 'libs/features/search/reducers';

import * as fromSaveExchangeScopeActions from '../actions/save-exchange-scope.actions';

@Injectable()
export class SaveExchangeScopeEffects {

  @Effect()
  upsertExchangeExplorerScopeSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(fromLibsPeerExchangeExplorerScopeActions.UPSERT_EXCHANGE_SCOPE_SUCCESS),
    map(() => new fromSaveExchangeScopeActions.CloseSaveExchangeScopeModal())
  );

  @Effect()
  loadParentPayMarketOptions$: Observable<Action> = this.actions$.pipe(
    ofType(fromSaveExchangeScopeActions.LOAD_PARENT_PAYMARKETS),
    withLatestFrom(
      this.store.pipe(select(fromSearchReducer.getParentFilters)),
      (action, filters) => {
        return {countryCodes: this.payfactorsSearchApiHelper.getSelectedFilterValues(filters, 'country_code')};
      }
    ),
    switchMap((payload) => this.payMarketApiService.getParentPayMarkets(payload.countryCodes).pipe(
      map(response => new fromSaveExchangeScopeActions.LoadParentPayMarketsSuccess(response)),
      catchError(() => of(new fromSaveExchangeScopeActions.LoadParentPayMarketsError()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<fromLibsExchangeExplorerReducer.State>,
    private payMarketApiService: PayMarketApiService,
    private payfactorsSearchApiHelper: PayfactorsSearchApiHelper
  ) {}
}
