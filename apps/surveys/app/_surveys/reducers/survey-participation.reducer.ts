import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { SurveyInfoByCompanyDto } from 'libs/models/survey';

import * as fromSurveyParticipationActions from '../actions/survey-participation.actions';

// Define our feature state
export interface State {
  modalOpen: boolean;
  surveyInfo: AsyncStateObj<SurveyInfoByCompanyDto[]>;
}

// Define our initial state
const initialState: State = {
  modalOpen: false,
  surveyInfo: generateDefaultAsyncStateObj<SurveyInfoByCompanyDto[]>([])
};

// Reducer function
export function reducer(state = initialState, action: fromSurveyParticipationActions.Actions): State {
  switch (action.type) {
    case fromSurveyParticipationActions.GET_SURVEY_INFO: {
      return AsyncStateObjHelper.loading(state, 'surveyInfo');
    }
    case fromSurveyParticipationActions.GET_SURVEY_INFO_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'surveyInfo', action.payload);
    }
    case fromSurveyParticipationActions.GET_SURVEY_INFO_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'surveyInfo');
    }
    case fromSurveyParticipationActions.OPEN_SURVEY_PARTICIPATION_MODAL: {
      return {
        ...state,
        modalOpen: true
      };
    }
    case fromSurveyParticipationActions.CLOSE_SURVEY_PARTICIPATION_MODAL: {
      return {
        ...state,
        modalOpen: false
      };
    }
    case fromSurveyParticipationActions.UPLOAD_SURVEY_PARTICIPATION_FILE: {
      const surveysClone: AsyncStateObj<SurveyInfoByCompanyDto[]> = cloneDeep(state.surveyInfo);
      const updatedSurvey: SurveyInfoByCompanyDto = surveysClone.obj.find(x => x.SurveyId === action.payload.SurveyId);
      updatedSurvey.UploadingFileError = null;
      return {
        ...state,
        surveyInfo: surveysClone
      };
    }
    case fromSurveyParticipationActions.UPLOAD_SURVEY_PARTICIPATION_FILE_ERROR: {
      const surveysClone: AsyncStateObj<SurveyInfoByCompanyDto[]> = cloneDeep(state.surveyInfo);
      const updatedSurvey: SurveyInfoByCompanyDto = surveysClone.obj.find(x => x.SurveyId === action.payload.SurveyId);
      updatedSurvey.UploadingFileError = 'Error uploading survey participation file.';
      return {
        ...state,
        surveyInfo: surveysClone
      };
    }
    case fromSurveyParticipationActions.SAVE_SURVEY_PARTICIPATION: {
      const surveysClone: AsyncStateObj<SurveyInfoByCompanyDto[]> = cloneDeep(state.surveyInfo);
      const updatedSurvey: SurveyInfoByCompanyDto = surveysClone.obj.find(x => x.SurveyId === action.payload.SurveyId);
      updatedSurvey.Saving = true;
      updatedSurvey.SavingError = null;
      updatedSurvey.SavingSuccess = false;
      return {
        ...state,
        surveyInfo: surveysClone
      };
    }
    case fromSurveyParticipationActions.SAVE_SURVEY_PARTICIPATION_SUCCESS: {
      const surveysClone: AsyncStateObj<SurveyInfoByCompanyDto[]> = cloneDeep(state.surveyInfo);
      const updatedSurvey: SurveyInfoByCompanyDto = surveysClone.obj.find(x => x.SurveyId === action.payload.SurveyId);
      updatedSurvey.Saving = false;
      updatedSurvey.SavingSuccess = true;
      updatedSurvey.ParticipationFileName = action.payload.ParticipationFileName;
      return {
        ...state,
        surveyInfo: surveysClone
      };
    }
    case fromSurveyParticipationActions.SAVE_SURVEY_PARTICIPATION_ERROR: {
      const surveysClone: AsyncStateObj<SurveyInfoByCompanyDto[]> = cloneDeep(state.surveyInfo);
      const updatedSurvey: SurveyInfoByCompanyDto = surveysClone.obj.find(x => x.SurveyId === action.payload.SurveyId);
      updatedSurvey.Saving = false;
      updatedSurvey.SavingError = 'Error saving survey participation file.';
      return {
        ...state,
        surveyInfo: surveysClone
      };
    }
    case fromSurveyParticipationActions.RESET_SURVEY_PARTICIPATION_UPLOAD_STATUS: {
      const surveysClone: AsyncStateObj<SurveyInfoByCompanyDto[]> = cloneDeep(state.surveyInfo);
      const updatedSurvey: SurveyInfoByCompanyDto = surveysClone.obj.find(x => x.SurveyId === action.surveyId);
      updatedSurvey.UploadingFileError = null;
      updatedSurvey.Saving = false;
      updatedSurvey.SavingError = null;
      updatedSurvey.SavingSuccess = false;
      return {
        ...state,
        surveyInfo: surveysClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getSurveyInfo = (state: State) => state.surveyInfo;
export const getSurveyParticipationModalOpen = (state: State) => state.modalOpen;
