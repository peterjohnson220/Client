import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import { SurveyLibraryApiService } from 'libs/data/payfactors-api/survey-library';

import { SurveyNote } from 'libs/models/payfactors-api/survey-library/survey-note-model';
import { MessageHelper } from 'libs/core/helpers';

import * as fromSurveyNotesActions from '../actions/survey-notes.actions';


@Injectable()
export class SurveyNotesEffects {
    @Effect()
    loadSurveyNotes$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromSurveyNotesActions.LOAD_SURVEY_NOTES),
            switchMap((action: fromSurveyNotesActions.LoadSurveyNotes) =>
                this.surveyLibraryApiService.getSurveyNotes(action.payload.surveyId).pipe(
                    map((response: any) => {
                        return new fromSurveyNotesActions.LoadSurveyNotesSuccess(response);
                }),
                catchError(error => of(new fromSurveyNotesActions.LoadSurveyNotesError(
                    {errorMessage: MessageHelper.buildErrorMessage('Error loading survey notes.')}
                ))
            )
        )
    ));

    @Effect()
    saveSurveyNote$: Observable<Action> = this.actions$
        .pipe(
            ofType(fromSurveyNotesActions.SAVE_SURVEY_NOTE),
            switchMap((action: fromSurveyNotesActions.SaveSurveyNote) =>
                this.surveyLibraryApiService.saveSurveyNote(action.payload.note, action.payload.actionType).pipe(
                    map((response: SurveyNote[]) => {
                        return new fromSurveyNotesActions.SaveSurveyNoteSuccess();
                }),
                catchError(error => of(new fromSurveyNotesActions.SaveSurveyNoteError(
                    {errorMessage: MessageHelper.buildErrorMessage(error + 'Error saving survey note.')}
                ))
            )
        )
    ));

    constructor(
        private actions$: Actions,
        private surveyLibraryApiService: SurveyLibraryApiService
    ) {}
}
