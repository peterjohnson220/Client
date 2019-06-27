import { Injectable } from '@angular/core';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import {catchError, mergeMap, switchMap} from 'rxjs/operators';

import { UserTicketApiService } from 'libs/data/payfactors-api';

import * as fromReducers from '../reducers';
import * as fromTicketAttachmentActions from '../actions/ticket-attachment.actions';
import * as fromTicketActions from '../actions/ticket.actions';

@Injectable()
export class TicketAttachmentEffects {
  @Effect()
  deleteTicketAttachment$: Observable<Action> = this.action$.pipe(
    ofType(fromTicketAttachmentActions.DELETE_ATTACHMENT),
    switchMap((action: fromTicketAttachmentActions.DeleteAttachment) =>
      this.userTicketApiService.deleteAttachment(action.payload).pipe(
        mergeMap(() => {
          return [
            new fromTicketAttachmentActions.DeleteAttachmentSuccess(),
            new fromTicketActions.LoadTicket(action.payload.UserTicketId)
          ];
        }),
        catchError(error => of(new fromTicketAttachmentActions.DeleteAttachmentError()))
      )
    )
  );

  constructor(
    private action$: Actions,
    private store: Store<fromReducers.State>,
    private userTicketApiService: UserTicketApiService
  ) {}
}
