import { Injectable } from '@angular/core';

import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { UserTicketApiService } from 'libs/data/payfactors-api/service';

import * as fromServicePageReducer from '../reducers';
import * as fromTicketNotesActions from '../actions/ticket-notes.actions';
import { PayfactorsApiModelMapper } from '../helpers';
import { UserTicketCommentRequest } from 'libs/models/payfactors-api/service/request';

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
              const notes = PayfactorsApiModelMapper.mapUserTicketCommentsToTicketNotes([response]);
              const addedNote = !!notes && !!notes.length ? notes[0] : null;
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
