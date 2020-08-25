import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { NotesApiService } from 'libs/data/payfactors-api';
import { NotesBase } from 'libs/models/notes';

import * as fromNotesManagerReducer from '../reducers';
import * as fromNotesManagerActions from '../actions';

@Injectable()
export class NotesManagerEffects {

  constructor(
    private actions$: Actions,
    private store: Store<fromNotesManagerReducer.State>,
    private notesService: NotesApiService,
  ) { }

  @Effect()
  loadNotes$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromNotesManagerActions.GET_NOTES),
      switchMap(
        (action: fromNotesManagerActions.GetNotes) =>
          this.notesService.getNotes(action.payload).pipe(
            map((notes: NotesBase[]) => {
              return new fromNotesManagerActions.GetNotesSuccess(notes);
            }),
            catchError(response => of(new fromNotesManagerActions.GetNotesError()))
          )
      )
    );

  @Effect()
  addNote$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromNotesManagerActions.ADD_NOTE),
      switchMap(
        (action: fromNotesManagerActions.AddNote) =>
          this.notesService.addNote(action.payload).pipe(
            map(response => {
              return new fromNotesManagerActions.AddNoteSuccess({
                Entity: action.payload.Entity,
                EntityId: action.payload.EntityId
              });
            }),
            catchError(response => of(new fromNotesManagerActions.AddNoteError(response)))
          )
      )
    );
}
