import cloneDeep from 'lodash/cloneDeep';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromSurveysPageActions from '../actions/surveys-page.actions';

// Define our feature state
export interface State {
  surveyFieldsModalOpen: boolean;
  participantsModalOpen: boolean;
  surveyParticipants: AsyncStateObj<string[]>;
}

// Define our initial state
const initialState: State = {
  surveyFieldsModalOpen: false,
  participantsModalOpen: false,
  surveyParticipants: generateDefaultAsyncStateObj<string[]>([])
};

// Reducer function
export function reducer(state = initialState, action: fromSurveysPageActions.Actions): State {
  switch (action.type) {
    case fromSurveysPageActions.OPEN_SURVEY_FIELDS_MODAL: {
      return {
        ...state,
        surveyFieldsModalOpen: true
      };
    }
    case fromSurveysPageActions.CLOSE_SURVEY_FIELDS_MODAL: {
      return {
        ...state,
        surveyFieldsModalOpen: false
      };
    }
    case fromSurveysPageActions.OPEN_PARTICIPANTS_MODAL: {
      return {
        ...state,
        participantsModalOpen: true
      };
    }
    case fromSurveysPageActions.CLOSE_PARTICIPANTS_MODAL: {
      return {
        ...state,
        participantsModalOpen: false
      };
    }
    case fromSurveysPageActions.GET_SURVEY_PARTICIPANTS: {
      const surveyParticipantsClone = cloneDeep(state.surveyParticipants);
      surveyParticipantsClone.loading = true;
      return {
        ...state,
        surveyParticipants: surveyParticipantsClone
      };
    }
    case fromSurveysPageActions.GET_SURVEY_PARTICIPANTS_SUCCESS: {
      const surveyParticipantsClone = cloneDeep(state.surveyParticipants);
      surveyParticipantsClone.loading = false;
      surveyParticipantsClone.obj = action.payload;
      return {
        ...state,
        surveyParticipants: surveyParticipantsClone
      };
    }
    case fromSurveysPageActions.GET_SURVEY_PARTICIPANTS_ERROR: {
      const surveyParticipantsClone = cloneDeep(state.surveyParticipants);
      surveyParticipantsClone.loading = false;
      surveyParticipantsClone.loadingError = true;
      return {
        ...state,
        surveyParticipants: surveyParticipantsClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getSurveyFieldsModalOpen = (state: State) => state.surveyFieldsModalOpen;
export const getParticipantsModalOpen = (state: State) => state.participantsModalOpen;
export const getSurveyParticipants = (state: State) => state.surveyParticipants;
