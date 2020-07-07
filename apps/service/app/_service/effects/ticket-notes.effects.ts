import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { UserTicketApiService } from 'libs/data/payfactors-api/service';
import { UserTicketCommentRequest } from 'libs/models/payfactors-api/service/request';
import { TicketCommentHelper } from 'libs/models/payfactors-api/service/helpers';

import * as fromServicePageReducer from '../reducers';
import * as fromTicketNotesActions from '../actions/ticket-notes.actions';

@Injectable()
export class TicketNotesEffects {

  @Effect()
  addNote$ = this.actions$
    .pipe(
      ofType(fromTicketNotesActions.ADD_NOTE),
      switchMap((action: fromTicketNotesActions.AddNote) => {
        const request: UserTicketCommentRequest = {
          UserTicketId: action.payload.ticketId,
          Comments: action.payload.note
        };
        return this.userTicketApiService.addNote(request)
          .pipe(
            map((response) => {
              const addedNote = TicketCommentHelper.mapNewlyAddedTicketCommentToComment(response);
              return new fromTicketNotesActions.AddNoteSuccess(addedNote);
          }),
            catchError((error) => of(new fromTicketNotesActions.AddNoteError()))
          );
      })
    );

  constructor(
    private actions$: Actions,
    private userTicketApiService: UserTicketApiService,
    private store: Store<fromServicePageReducer.State>
  ) {}
}
