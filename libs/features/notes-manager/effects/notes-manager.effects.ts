import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromNotesManagerReducer from '../reducers';
import * as fromNotesManagerActions from '../actions';

import { PricingApiService } from 'libs/data/payfactors-api';
import { PricingNote } from 'libs/models/payfactors-api';

@Injectable()
export class NotesManagerEffects {

  constructor(
    private actions$: Actions,
    private store: Store<fromNotesManagerReducer.State>,
    private pricingApiService: PricingApiService,
  ) { }

  @Effect()
  loadNotes$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromNotesManagerActions.GET_NOTES),
      switchMap(
        (action: fromNotesManagerActions.GetNotes) =>
          this.pricingApiService.getNotes(action.payload).pipe(
            map((pricingNotes: PricingNote[]) => {
              pricingNotes.sort((a, b) => b.CompanyJobPricingNoteId - a.CompanyJobPricingNoteId);
              return new fromNotesManagerActions.GetNotesSuccess(pricingNotes);
            }),
            catchError(response => of(new fromNotesManagerActions.GetNotesError()))
          )
      )
    );
}
