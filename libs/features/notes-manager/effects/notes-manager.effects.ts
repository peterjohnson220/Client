import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';

import { BaseNotesApiService, CompanyJobsNotesApi, PricingMatchNotesApi, PricingNotesApi } from 'libs/data/payfactors-api';
import { NoteRequest, NotesBase } from 'libs/models/notes';

import * as fromNotesManagerReducer from '../reducers';
import * as fromNotesManagerActions from '../actions';
import { ApiServiceType } from '../constants/api-service-type-constants';
import { State } from '../reducers/notes-manager.reducer';
import { SaveNotesRequest } from '../../../models/payfactors-api/notes/save-notes-request.model';
import { IsNullOrEmpty } from '../../../../apps/data-insights/app/_data-view/models';

@Injectable()
export class NotesManagerEffects {

  constructor(
    private actions$: Actions,
    private store: Store<fromNotesManagerReducer.State>,
    private companyJobsNotesApi: CompanyJobsNotesApi,
    private pricingMatchNotesApi: PricingMatchNotesApi,
    private pricingNotesApi: PricingNotesApi
  ) { }

  @Effect()
  loadNotes$: Observable<Action> = this.actions$
    .pipe(
      ofType(fromNotesManagerActions.GET_NOTES),
      mergeMap((getNotes: fromNotesManagerActions.GetNotes) =>
        of(getNotes).pipe(
          withLatestFrom(
            this.store.pipe(select(fromNotesManagerReducer.getApiServiceIndicator)),
            (action: fromNotesManagerActions.GetNotes, apiServiceIndicator) =>
              ({ action, apiServiceIndicator})
          )
        )
      ),
      switchMap((data) =>
        this.selectServiceApi(data.apiServiceIndicator).getNotes(data.action.payload).pipe(
          map((notes: NotesBase[]) => {
            return new fromNotesManagerActions.GetNotesSuccess(notes);
          }),
          catchError(response => of(new fromNotesManagerActions.GetNotesError(response)))
        )
      )
    );

  @Effect()
  saveNotes$ = this.actions$
    .pipe(
      ofType(fromNotesManagerActions.SAVE_NOTES),
      mergeMap((saveNotes: fromNotesManagerActions.SaveNotes) =>
        of(saveNotes).pipe(
          withLatestFrom(
            this.store.pipe(select(fromNotesManagerReducer.getApiServiceIndicator)),
            this.store.pipe(select(fromNotesManagerReducer.getNotes)),
            (action: fromNotesManagerActions.SaveNotes, apiServiceIndicator, notes) =>
              ({ action, apiServiceIndicator, notes})
          )
        )
      ),
      switchMap((data) =>
        this.selectServiceApi(data.apiServiceIndicator).saveNotes(this.generateSaveNoteRequest(data.notes.obj, data.action.payload)).pipe(
          map((response: any) => {
            return new fromNotesManagerActions.SaveNotesSuccess(data.apiServiceIndicator);
          }),
          catchError(response => of(new fromNotesManagerActions.SaveNotesError(response)))
        )
      )
    );

  private selectServiceApi(selectedService: ApiServiceType): BaseNotesApiService {
    switch (selectedService) {
      case ApiServiceType.CompanyJobs:
        return this.companyJobsNotesApi;
      case ApiServiceType.PricingMatch:
        return this.pricingMatchNotesApi;
      case ApiServiceType.Pricing:
        return this.pricingNotesApi;
    }
  }

  private generateSaveNoteRequest(notes: NotesBase[], entityId: number): SaveNotesRequest {
    const noteRequestList: NoteRequest[] = [];
    notes.forEach(note => {
      if (note.NoteOperation !== null) {
        const newNoteRequest: NoteRequest = {
          NoteId: note.Id,
          NoteText: note.Notes,
          NoteOperation: note.NoteOperation
        };

        noteRequestList.push(newNoteRequest);
      }
    });

    return { entityId: entityId, noteRequestList: noteRequestList };
  }
}
