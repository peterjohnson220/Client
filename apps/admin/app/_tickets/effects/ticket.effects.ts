import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, mergeMap, map } from 'rxjs/operators';

import { UserTicketResponse} from 'libs/models/payfactors-api/service/response';

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
                          new fromTicketActions.LoadTicketSuccess(ticket)
                        ];
                    }),
                    catchError(error => of(new fromTicketActions.LoadTicketError()))
                )
            )
        );

    constructor(
        private actions$: Actions,
        private userTicketApiService: UserTicketApiService
    ) {}
}
