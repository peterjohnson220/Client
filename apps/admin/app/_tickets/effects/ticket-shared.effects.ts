import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, mergeMap, switchMap, map } from 'rxjs/operators';

import { UserTicketApiService } from 'libs/data/payfactors-api';

import * as fromReducers from '../reducers';
import * as fromTicketSharedActions from '../actions/ticket-shared.actions';

@Injectable()
export class TicketSharedEffects {


    @Effect()
    loadCompanyDetail$: Observable<Action> = this.actions$.pipe(
        ofType(fromTicketSharedActions.GET_USER_DETAIL),
        switchMap((action: fromTicketSharedActions.GetUserDetail) =>
            this.userTicketApiService.getUserDetail(action.userid).pipe(
                map((response: any) => {
                    return new fromTicketSharedActions.GetUserDetailSuccess(response, action.ticketId);
                }),
                catchError(error => of(new fromTicketSharedActions.GetUserDetailFailed()))
            )
        )
    );



    constructor(
        private actions$: Actions,
        private store: Store<fromReducers.State>,
        private userTicketApiService: UserTicketApiService
    ) { }
}
