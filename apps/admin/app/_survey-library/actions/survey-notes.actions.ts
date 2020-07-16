import { Action } from '@ngrx/store';

import { SurveyNote } from 'libs/models/payfactors-api/survey-library/survey-note-model';


export const LOAD_SURVEY_NOTES = '[Admin / Survey Library] Load Survey Notes';
export const LOAD_SURVEY_NOTES_SUCCESS = '[Admin / Survey Library] Load Survey Notes Success';
export const LOAD_SURVEY_NOTES_ERROR = '[Admin / Survey Library] Load Survey Notes Error';

export const SAVE_SURVEY_NOTE = '[Admin / Survey Library] Save Survey Notes';
export const SAVE_SURVEY_NOTE_SUCCESS = '[Admin / Survey Library] Save Survey Notes Success';
export const SAVE_SURVEY_NOTE_ERROR = '[Admin / Survey Library] Save Survey Notes Error';

export const RESET_SURVEY_NOTE_STATE = '[Admin / Survey Library] Reset Survey Notes State';


export class LoadSurveyNotes implements Action {
    readonly type = LOAD_SURVEY_NOTES;

    constructor(public payload: {surveyId: number}) {}
}

export class LoadSurveyNotesSuccess implements Action {
    readonly type = LOAD_SURVEY_NOTES_SUCCESS;

    constructor(public payload: SurveyNote[]) {}
}

export class LoadSurveyNotesError implements Action {
    readonly type = LOAD_SURVEY_NOTES_ERROR;

    constructor(public payload: {errorMessage: string}) {}
}

export class SaveSurveyNote implements Action {
    readonly type = SAVE_SURVEY_NOTE;

    constructor(public payload: {note: SurveyNote, actionType: string}) {}
}

export class SaveSurveyNoteSuccess implements Action {
    readonly type = SAVE_SURVEY_NOTE_SUCCESS;
}

export class SaveSurveyNoteError implements Action {
    readonly type = SAVE_SURVEY_NOTE_ERROR;

    constructor(public payload: {errorMessage: string}) {}
}

export class ResetSurveyNotes implements Action {
    readonly type = RESET_SURVEY_NOTE_STATE;
}

  export type Actions
  = LoadSurveyNotes
  | LoadSurveyNotesSuccess
  | LoadSurveyNotesError
  | SaveSurveyNote
  | SaveSurveyNoteSuccess
  | SaveSurveyNoteError
  | ResetSurveyNotes;
