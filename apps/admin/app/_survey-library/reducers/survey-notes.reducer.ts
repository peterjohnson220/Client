import { AsyncStateObjHelper } from 'libs/core';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';

import * as fromSurveyNotesActions from '../actions/survey-notes.actions';
import { SurveyNote } from 'libs/models/payfactors-api/survey-library/survey-note-model';

export interface State {
  surveyNotes: AsyncStateObj<SurveyNote[]>;
}

export const initialState: State = {
  surveyNotes: generateDefaultAsyncStateObj<SurveyNote[]>([])
};

export function reducer(state = initialState, action: fromSurveyNotesActions.Actions): State {
  switch (action.type) {
    case fromSurveyNotesActions.LOAD_SURVEY_NOTES:
      return AsyncStateObjHelper.loading(state, 'surveyNotes');
    case fromSurveyNotesActions.LOAD_SURVEY_NOTES_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'surveyNotes');
    case fromSurveyNotesActions.LOAD_SURVEY_NOTES_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'surveyNotes', action.payload);
    case fromSurveyNotesActions.SAVE_SURVEY_NOTE:
      return AsyncStateObjHelper.saving(state, 'surveyNotes');
    case fromSurveyNotesActions.SAVE_SURVEY_NOTE_ERROR:
      return AsyncStateObjHelper.savingError(state, 'surveyNotes');
    case fromSurveyNotesActions.SAVE_SURVEY_NOTE_SUCCESS:
      return AsyncStateObjHelper.savingSuccess(state, 'surveyNotes');
    case fromSurveyNotesActions.RESET_SURVEY_NOTE_STATE:
        return initialState;
    default:
      return state;
  }
}

export const getNotes = (state: State) => state.surveyNotes;
