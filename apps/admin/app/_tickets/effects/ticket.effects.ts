import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, mergeMap, map } from 'rxjs/operators';

import {
  UserTicketCompanyDetailResponse, UserTicketResponse, UserTicketStateResponse, UserTicketTypeResponse
} from 'libs/models/payfactors-api/service/response';

import { UserTicketApiService } from 'libs/data/payfactors-api';
import * as fromTicketActions from '../actions/ticket.actions';
import { PayfactorsApiModelMapper } from '../helpers';


@Injectable()
export class TicketEffects {
    @Effect()
    loadTicket$: Observable<Action> = this.actions$
        .ofType(fromTicketActions.LOAD_TICKET).pipe(
            switchMap((action: fromTicketActions.LoadTicket) =>
                this.userTicketApiService.getUserTicket(action.payload).pipe(
                    mergeMap((userTicket: UserTicketResponse) => {
                        const ticket = PayfactorsApiModelMapper.mapUserTicketResponseToUserTicketItem(userTicket);
                        return [
                          new fromTicketActions.LoadTicketSuccess(ticket),
                          new fromTicketActions.LoadCompanyDetail({ companyId: userTicket.CompanyId})
                        ];
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

    @Effect()
    loadTicketStates$: Observable<Action> = this.actions$
        .ofType(fromTicketActions.LOAD_TICKETSTATES).pipe(
            switchMap((action: fromTicketActions.LoadTicketStates) =>
                this.userTicketApiService.getUserTicketStates().pipe(
                    map((ticketStates: UserTicketStateResponse[]) => {
                        return new fromTicketActions.LoadTicketStatesSuccess(ticketStates);
                    }),
                    catchError(error => of(new fromTicketActions.LoadTicketStatesError()))
                )
            )
        );

    @Effect()
    loadTicketTypes$: Observable<Action> = this.actions$
        .ofType(fromTicketActions.LOAD_TICKETSTATES).pipe(
            switchMap((action: fromTicketActions.LoadTicketTypes) =>
                this.userTicketApiService.getUserTicketTypes().pipe(
                    map((ticketTypes: UserTicketTypeResponse[]) => {
                      return new fromTicketActions.LoadTicketTypesSuccess(ticketTypes);
                    }),
                    catchError(error => of(new fromTicketActions.LoadTicketTypesError()))
                )
            )
        );

    constructor(
        private actions$: Actions,
        private userTicketApiService: UserTicketApiService
    ) {}
}
