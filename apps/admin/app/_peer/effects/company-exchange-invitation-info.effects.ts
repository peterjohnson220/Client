import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';

import { ExchangeApiService } from 'libs/data/payfactors-api/peer';

import { GridHelperService } from '../services';
import * as fromCompanyExchangeInvitationInfoActions from '../actions/company-exchange-invitation-info.actions';

@Injectable()
export class CompanyExchangeInvitationInfoEffects {

  @Effect()
  approveCompanyExchangeInvitation$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyExchangeInvitationInfoActions.APPROVE_COMPANY_EXCHANGE_INVITATION),
      map((action: fromCompanyExchangeInvitationInfoActions.ApproveCompanyExchangeInvitation) => action.payload),
      switchMap(payload => {
        return this.exchangeApiService.approveCompanyExchangeInvitaiton(payload).pipe(
          map(() => {
            payload.PayfactorsCompany ? this.gridHelperService.loadPayfactorsCompanyExchangeInvitations(payload.ExchangeId) :
                                        this.gridHelperService.loadNewCompanyExchangeInvitations(payload.ExchangeId);
            this.gridHelperService.loadExchangeCompanies(payload.ExchangeId);
            return new fromCompanyExchangeInvitationInfoActions.ApproveCompanyExchangeInvitationSuccess();
          }),
          catchError(error => of(new fromCompanyExchangeInvitationInfoActions.ApproveCompanyExchangeInvitationError()))
        );
      })
    );

  @Effect()
  denyCompanyExchangeInvitation$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyExchangeInvitationInfoActions.DENY_COMPANY_EXCHANGE_INVITATION),
    map((action: fromCompanyExchangeInvitationInfoActions.DenyCompanyExchangeInvitation) => action.payload),
    switchMap(payload => {
      return this.exchangeApiService.denyCompanyExchangeInvitation(payload).pipe(
        map(() => {
          payload.PayfactorsCompany ? this.gridHelperService.loadPayfactorsCompanyExchangeInvitations(payload.ExchangeId) :
                                      this.gridHelperService.loadNewCompanyExchangeInvitations(payload.ExchangeId);
          return new fromCompanyExchangeInvitationInfoActions.DenyCompanyExchangeInvitationSuccess();
        }),
        catchError(error => of(new fromCompanyExchangeInvitationInfoActions.DenyCompanyExchangeInvitationError()))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private gridHelperService: GridHelperService
  ) {}
}
