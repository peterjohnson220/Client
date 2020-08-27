import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromFlsaQuestionnaireActions from '../actions/flsa-questionnaire-modal.actions';
import { FlsaQuestionnaireDetails } from '../models';

export interface State {
  flsaQuestionnaireDetails: AsyncStateObj<FlsaQuestionnaireDetails>;
  saving: boolean;
}

export const initialState: State = {
  flsaQuestionnaireDetails: generateDefaultAsyncStateObj<FlsaQuestionnaireDetails>(null),
  saving: false
};

export function reducer(state = initialState, action: fromFlsaQuestionnaireActions.Actions): State {
  switch (action.type) {
    case fromFlsaQuestionnaireActions.LOAD_FLSA_QUESTIONNAIRE: {
      const flsaQuestionnaireDetailsAsync = cloneDeep(state.flsaQuestionnaireDetails);
      flsaQuestionnaireDetailsAsync.loading = true;
      flsaQuestionnaireDetailsAsync.obj = null;
      return {
        ...state,
        flsaQuestionnaireDetails: flsaQuestionnaireDetailsAsync
      };
    }
    case fromFlsaQuestionnaireActions.LOAD_FLSA_QUESTIONNAIRE_SUCCESS: {
      const flsaQuestionnaireDetailsAsync = cloneDeep(state.flsaQuestionnaireDetails);
      flsaQuestionnaireDetailsAsync.loading = false;
      flsaQuestionnaireDetailsAsync.obj = action.payload;
      return {
        ...state,
        flsaQuestionnaireDetails: flsaQuestionnaireDetailsAsync
      };
    }
    case fromFlsaQuestionnaireActions.LOAD_FLSA_QUESTIONNAIRE: {
      const flsaQuestionnaireDetailsAsync = cloneDeep(state.flsaQuestionnaireDetails);
      flsaQuestionnaireDetailsAsync.loading = false;
      flsaQuestionnaireDetailsAsync.loadingError = true;
      return {
        ...state,
        flsaQuestionnaireDetails: flsaQuestionnaireDetailsAsync
      };
    }
    case fromFlsaQuestionnaireActions.SAVE_FLSA_QUESTIONNAIRE:
      return {
        ...state,
        saving: true
      };
    case fromFlsaQuestionnaireActions.SAVE_FLSA_QUESTIONNAIRE_SUCCESS: {
      const flsaQuestionnaireDetailsAsync = cloneDeep(state.flsaQuestionnaireDetails);
      flsaQuestionnaireDetailsAsync.obj.FlsaQuestionnaireVersion = action.payload.FlsaQuestionnaireVersion;
      flsaQuestionnaireDetailsAsync.obj.FlsaQuestionnaireStatus = action.payload.FlsaQuestionnaireStatus;
      flsaQuestionnaireDetailsAsync.obj.EditDate = action.payload.EditDate;
      flsaQuestionnaireDetailsAsync.obj.EditUser = action.payload.EditUser;
      return {
        ...state,
        flsaQuestionnaireDetails: flsaQuestionnaireDetailsAsync,
        saving: false
      };
    }
    case fromFlsaQuestionnaireActions.SAVE_FLSA_QUESTIONNAIRE_ERROR:
      return {
        ...state,
        saving: false
      };
    case fromFlsaQuestionnaireActions.SELECT_FLSA_QUESTION: {
      const flsaQuestionnaireDetailsAsync = cloneDeep(state.flsaQuestionnaireDetails);
      const exemption = flsaQuestionnaireDetailsAsync.obj.ExemptionAndQuestions.find(e => e.Exemption === action.payload.exemption);
      if (exemption) {
        const question = exemption.Questions.find(q => q.Question === action.payload.question);
        if (question) {
          question.Selected = action.payload.selected;
        }
      }
      return {
        ...state,
        flsaQuestionnaireDetails: flsaQuestionnaireDetailsAsync
      };
    }
    default:
      return state;
  }
}

export const getFlsaQuestionnaireDetails = (state: State) => state.flsaQuestionnaireDetails;
export const getSavingFlsaQuestionnaireDetails = (state: State) => state.saving;
