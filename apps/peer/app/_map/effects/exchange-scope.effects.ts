import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as fromLibsPeerExchangeExplorerScopeActions from 'libs/features/peer/exchange-explorer/actions/exchange-scope.actions';

import * as fromExchangeScopeActions from '../actions/exchange-scope.actions';

@Injectable()
export class ExchangeScopeEffects {

  @Effect()
  upsertExchangeExplorerScopeSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(fromLibsPeerExchangeExplorerScopeActions.UPSERT_EXCHANGE_SCOPE_SUCCESS),
    map(() => new fromExchangeScopeActions.CloseSaveExchangeScopeModal())
  );

  constructor(
    private actions$: Actions
  ) {}
}
