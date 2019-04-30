import { Injectable } from '@angular/core';

import { Action, Store } from '@ngrx/store';
import {Effect, Actions, ofType} from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {switchMap, catchError, mergeMap, map, withLatestFrom} from 'rxjs/operators';

import { UserTicketCompanyDetailResponse, UserTicketResponse } from 'libs/models/payfactors-api/service/response';

import { UserTicketApiService } from 'libs/data/payfactors-api';
import * as fromTicketActions from '../actions/ticket.actions';
import * as fromTicketLookupActions from '../actions/ticket-lookup.actions';
import * as fromReducers from '../reducers';
import { PayfactorsApiModelMapper } from '../helpers';

@Injectable()
export class TicketEffects {
    @Effect()
    loadTicket$: Observable<Action> = this.actions$.pipe(
        ofType<fromTicketActions.LoadTicket>(fromTicketActions.LOAD_TICKET),
        withLatestFrom(
          this.store.select(fromReducers.getUserTicketTypes),
          this.store.select(fromReducers.getUserTicketStates),
          (action, userTicketTypes, userTicketStates) => {
            return { action, userTicketTypes, userTicketStates };
          }
        ),
        switchMap(obj =>
            this.userTicketApiService.getUserTicket(obj.action.payload).pipe(
                mergeMap((userTicket: UserTicketResponse) => {
                    const ticket = PayfactorsApiModelMapper.mapUserTicketResponseToUserTicketItem(userTicket);
                    const actions = [];
                    actions.push(new fromTicketActions.LoadTicketSuccess(ticket));
                    actions.push(new fromTicketActions.LoadCompanyDetail({ companyId: userTicket.CompanyId}));

                    if (!obj.userTicketTypes.length) {
                      actions.push(new fromTicketLookupActions.LoadTicketTypes());
                    }
                    if (!obj.userTicketStates.length) {
                      actions.push(new fromTicketLookupActions.LoadTicketStates());
                    }
                    return actions;
                }),
                catchError(error => of(new fromTicketActions.LoadTicketError()))
            )
        )
    );

  @Effect()
  loadCompanyDetail$: Observable<Action> = this.actions$
    .ofType(fromTicketActions.LOAD_COMPANY_DETAIL).pipe(
      switchMap((action: fromTicketActions.LoadCompanyDetail) =>
        this.userTicketApiService.getCompanyDetails(action.payload.companyId).pipe(
          map((companyDetailResponse: UserTicketCompanyDetailResponse) => {
            const companyDetail = PayfactorsApiModelMapper.mapUserTicketCompanyDetailResponseToCompanyDetail(companyDetailResponse);
            return new fromTicketActions.LoadCompanyDetailSuccess({ companyDetail: companyDetail});
          }),
          catchError(error => of(new fromTicketActions.LoadCompanyDetailError()))
        )
      )
    );

    constructor(
        private actions$: Actions,
        private store: Store<fromReducers.State>,
        private userTicketApiService: UserTicketApiService
    ) {}
}
