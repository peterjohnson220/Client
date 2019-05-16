import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import {switchMap, catchError, map, mergeMap} from 'rxjs/operators';

import { UserTicketResponse } from 'libs/models/payfactors-api/service/response';
import { UserTicketApiService } from 'libs/data/payfactors-api';

import * as fromTicketListActions from '../actions/ticket-list.actions';
import {PayfactorsApiModelMapper} from '../helpers';

@Injectable()
export class TicketListEffects {
    @Effect()
    loadTickets$: Observable<Action> = this.actions$
        .ofType(fromTicketListActions.LOAD_TICKETS).pipe(
            switchMap((action: fromTicketListActions.LoadTickets) =>
                this.userTicketApiService.searchUserTickets(action.payload).pipe(
                    mergeMap((userTickets: UserTicketResponse[]) => {
                      const userTicketGridItems = PayfactorsApiModelMapper.mapUserTicketResponseToUserTicketGridItem(userTickets);
                      return [
                        new fromTicketListActions.LoadTicketsSuccess(userTicketGridItems),
                        new fromTicketListActions.SetGridDirtyStatus(false)
                      ];
                    }),
                    catchError(error => of(new fromTicketListActions.LoadTicketsError()))
                )
            )
        );

    constructor(
        private actions$: Actions,
        private userTicketApiService: UserTicketApiService
    ) {}
}
