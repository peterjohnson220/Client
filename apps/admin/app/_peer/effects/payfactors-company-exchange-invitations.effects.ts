import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ExchangeApiService } from 'libs/data/payfactors-api';

import * as fromPayfactorsCompanyExchangeInvitationsActions from '../actions/payfactors-company-exchange-invitations.actions';

@Injectable()
export class PayfactorsCompanyExchangeInvitationsEffects {

  @Effect()
  loadPayfactorsCompanyExchangeInvitations$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromPayfactorsCompanyExchangeInvitationsActions.LOAD_PAYFACTORS_COMPANY_EXCHANGE_INVITATIONS),
      map((action: fromPayfactorsCompanyExchangeInvitationsActions.LoadPayfactorsCompanyExchangeInvitations) => action.payload),
      switchMap(payload =>  {
        return this.exchangeApiService.getPendingPayfactorsCompanyExchangeInvitations(payload.exchangeId).pipe(
          map((payfactorsCompanyExchangeInvitationsResult: GridDataResult) => {
            return new fromPayfactorsCompanyExchangeInvitationsActions
              .LoadPayfactorsCompanyExchangeInvitationsSuccess(payfactorsCompanyExchangeInvitationsResult);
          }),
          catchError(error => of(new fromPayfactorsCompanyExchangeInvitationsActions.LoadPayfactorsCompanyExchangeInvitationsError()))
        );
      }
    )
  );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService
  ) {}
}
