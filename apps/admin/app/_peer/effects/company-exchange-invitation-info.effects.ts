import { Injectable } from '@angular/core';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { ExchangeApiService } from 'libs/data/payfactors-api/peer';
import { ExchangeRequestActionEnum, ExchangeRequestPeopleToNotifyEnum } from 'libs/models/peer';

import { GridHelperService } from '../services';
import * as fromCompanyExchangeInvitationInfoActions from '../actions/company-exchange-invitation-info.actions';
import * as fromPeerAdminReducer from '../reducers';

@Injectable()
export class CompanyExchangeInvitationInfoEffects {

  @Effect()
  approveCompanyExchangeInvitation$: Observable<Action> = this.actions$.pipe(
    ofType(fromCompanyExchangeInvitationInfoActions.APPROVE_COMPANY_EXCHANGE_INVITATION),
      map((action: fromCompanyExchangeInvitationInfoActions.ApproveCompanyExchangeInvitation) => action.payload),
        withLatestFrom(this.store.pipe(select(fromPeerAdminReducer.getSelectedCompanyExchangeInvitation)),
          (actionPayload, storePayload) => {
            return { actionPayload, storePayload };
          }
        ),
      switchMap(payload => {
        return this.exchangeApiService.companyExchangeInvitationAction(payload.storePayload, payload.actionPayload.reason,
          payload.actionPayload.peopleToNotify, ExchangeRequestActionEnum.Approve).pipe(
          map(() => {
            payload.storePayload.PayfactorsCompany ?
                                        this.gridHelperService.loadPayfactorsCompanyExchangeInvitations(payload.storePayload.ExchangeId) :
                                        this.gridHelperService.loadNewCompanyExchangeInvitations(payload.storePayload.ExchangeId);
            this.gridHelperService.loadExchangeCompanies(payload.storePayload.ExchangeId);
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
    withLatestFrom(this.store.pipe(select(fromPeerAdminReducer.getSelectedCompanyExchangeInvitation)),
      (actionPayload, storePayload) => {
      return { actionPayload, storePayload };
      }
    ),
    switchMap(payload => {
      return this.exchangeApiService.companyExchangeInvitationAction(payload.storePayload, payload.actionPayload,
        ExchangeRequestPeopleToNotifyEnum.RequestorOnly, ExchangeRequestActionEnum.Deny).pipe(
        map(() => {
          payload.storePayload.PayfactorsCompany ?
                                      this.gridHelperService.loadPayfactorsCompanyExchangeInvitations(payload.storePayload.ExchangeId) :
                                      this.gridHelperService.loadNewCompanyExchangeInvitations(payload.storePayload.ExchangeId);
          return new fromCompanyExchangeInvitationInfoActions.DenyCompanyExchangeInvitationSuccess();
        }),
        catchError(error => of(new fromCompanyExchangeInvitationInfoActions.DenyCompanyExchangeInvitationError()))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private exchangeApiService: ExchangeApiService,
    private gridHelperService: GridHelperService,
    private store: Store<fromPeerAdminReducer.State>
  ) {}
}
