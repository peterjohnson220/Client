import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';

import * as fromNewCompanyExchangeInvitationsActions from '../actions/new-company-exchange-invitations.actions';

@Injectable()
export class NewCompanyExchangeInvitationsEffects {

  @Effect()
  loadNewCompanyExchangeInvitations$: Observable<Action> = this.actions$
    .ofType(fromNewCompanyExchangeInvitationsActions.LOAD_NEW_COMPANY_EXCHANGE_INVITATIONS).pipe(
      map((action: fromNewCompanyExchangeInvitationsActions.LoadNewCompanyExchangeInvitations) => action.payload),
      switchMap(payload => {
        return this.exchangeApiService.getPendingNewCompanyExchangeInvitations(payload.exchangeId).pipe(
          map((newCompanyExchangeInvitationResult: GridDataResult) => {
            return new fromNewCompanyExchangeInvitationsActions
              .LoadNewCompanyExchangeInvitationsSuccess(newCompanyExchangeInvitationResult);
          }),
          catchError(error => of(new fromNewCompanyExchangeInvitationsActions.LoadNewCompanyExchangeInvitationsError()))
        );
      }
    )
  );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService
  ) {}
}
