import cloneDeep from 'lodash/cloneDeep';

import * as fromModelSettingsModalActions from '../actions/model-settings-modal.actions';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import { Currency, ControlPoint } from '../models';

export interface State {
  gradeModalOpen: boolean;
  jobModalOpen: boolean;
  currenciesAsyncObj: AsyncStateObj<Currency[]>;
  controlPointsAsyncObj: AsyncStateObj<ControlPoint[]>;
  surveyUdfsAsyncObj: AsyncStateObj<ControlPoint[]>;
  structureNameSuggestionsAsyncObj: AsyncStateObj<string[]>;
  savingModelingSettingsAsyncObj: AsyncStateObj<any>;
  modelNameExistsFailure: boolean;
  gradesDetails: AsyncStateObj<any>;
  structureHasSettings: AsyncStateObj<any>;
}

const initialState: State = {
  gradeModalOpen: false,
  jobModalOpen: false,
  currenciesAsyncObj: generateDefaultAsyncStateObj<Currency[]>([]),
  controlPointsAsyncObj: generateDefaultAsyncStateObj<ControlPoint[]>([]),
  surveyUdfsAsyncObj: generateDefaultAsyncStateObj<ControlPoint[]>([]),
  structureNameSuggestionsAsyncObj: generateDefaultAsyncStateObj<string[]>([]),
  savingModelingSettingsAsyncObj: generateDefaultAsyncStateObj<any>(null),
  modelNameExistsFailure: false,
  gradesDetails: generateDefaultAsyncStateObj<any>(null),
  structureHasSettings: generateDefaultAsyncStateObj<any>(null)
};

export function reducer(state = initialState, action: fromModelSettingsModalActions.ModelSettingsModalActions): State {
  switch (action.type) {
    case fromModelSettingsModalActions.OPEN_GRADE_MODAL:
      return {
        ...state,
        gradeModalOpen: true
      };
    case fromModelSettingsModalActions.OPEN_JOB_MODAL:
      return {
        ...state,
        jobModalOpen: true
      };
    case fromModelSettingsModalActions.CLOSE_MODAL:
      state = AsyncStateObjHelper.resetErrors(state, 'savingModelingSettingsAsyncObj');
      return {
        ...state,
        gradeModalOpen: false,
        jobModalOpen: false
      };
    case fromModelSettingsModalActions.GET_CURRENCIES:
      return AsyncStateObjHelper.loading(state, 'currenciesAsyncObj');
    case fromModelSettingsModalActions.GET_CURRENCIES_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'currenciesAsyncObj', action.payload);
    case fromModelSettingsModalActions.GET_CURRENCIES_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'currenciesAsyncObj');
    case fromModelSettingsModalActions.GET_SURVEY_UDFS:
      return AsyncStateObjHelper.loading(state, 'surveyUdfsAsyncObj');
    case fromModelSettingsModalActions.GET_SURVEY_UDFS_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'surveyUdfsAsyncObj', action.payload);
    case fromModelSettingsModalActions.GET_SURVEY_UDFS_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'surveyUdfsAsyncObj');
    case fromModelSettingsModalActions.GET_CONTROL_POINTS:
      return AsyncStateObjHelper.loading(state, 'controlPointsAsyncObj');
    case fromModelSettingsModalActions.GET_CONTROL_POINTS_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'controlPointsAsyncObj', action.payload);
    case fromModelSettingsModalActions.GET_CONTROL_POINTS_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'controlPointsAsyncObj');
    case fromModelSettingsModalActions.GET_STRUCTURE_NAME_SUGGESTIONS:
      return AsyncStateObjHelper.loading(state, 'structureNameSuggestionsAsyncObj');
    case fromModelSettingsModalActions.GET_STRUCTURE_NAME_SUGGESTIONS_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'structureNameSuggestionsAsyncObj', action.payload);
    case fromModelSettingsModalActions.GET_STRUCTURE_NAME_SUGGESTIONS_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'structureNameSuggestionsAsyncObj');
    case fromModelSettingsModalActions.SAVE_JOB_BASED_MODEL_SETTINGS:
    case fromModelSettingsModalActions.SAVE_GRADE_BASED_MODEL_SETTINGS:
      return AsyncStateObjHelper.saving(state, 'savingModelingSettingsAsyncObj');
    case fromModelSettingsModalActions.SAVE_JOB_BASED_MODEL_SETTINGS_SUCCESS:
    case fromModelSettingsModalActions.SAVE_GRADE_BASED_MODEL_SETTINGS_SUCCESS:
      return AsyncStateObjHelper.savingSuccess(state, 'savingModelingSettingsAsyncObj');
    case fromModelSettingsModalActions.SAVE_JOB_BASED_MODEL_SETTINGS_ERROR:
      return AsyncStateObjHelper.savingError(state, 'savingModelingSettingsAsyncObj');
    case fromModelSettingsModalActions.SAVE_GRADE_BASED_MODEL_SETTINGS_ERROR:
      return AsyncStateObjHelper.savingError(state, 'savingModelingSettingsAsyncObj', action.error);
    case fromModelSettingsModalActions.MODEL_NAME_EXISTS_FAILURE: {
      return {
        ...state,
        modelNameExistsFailure: true,
        savingModelingSettingsAsyncObj: {...state.savingModelingSettingsAsyncObj, saving: false}
      };
    }
    case fromModelSettingsModalActions.CLEAR_MODEL_NAME_EXISTS_FAILURE: {
      return {
        ...state,
        modelNameExistsFailure: false
      };
    }
    case fromModelSettingsModalActions.GET_GRADES_DETAILS: {
      const gradesDetails = cloneDeep(state.gradesDetails);

      gradesDetails.loading = true;
      gradesDetails.obj = null;
      gradesDetails.loadingError = false;

      return {
        ...state,
        gradesDetails: gradesDetails
      };
    }
    case fromModelSettingsModalActions.GET_GRADES_DETAILS_SUCCESS: {
      const gradesDetails = cloneDeep(state.gradesDetails);

      gradesDetails.loading = false;
      gradesDetails.obj = action.payload;

      return {
        ...state,
        gradesDetails: gradesDetails
      };
    }
    case fromModelSettingsModalActions.GET_GRADES_DETAILS_ERROR: {
      const gradesDetails = cloneDeep(state.gradesDetails);

      gradesDetails.loading = false;
      gradesDetails.loadingError = true;

      return {
        ...state,
        gradesDetails: gradesDetails
      };
    }
    case fromModelSettingsModalActions.GET_STRUCTURE_HAS_SETTINGS: {
      return AsyncStateObjHelper.loading(state, 'structureHasSettings');
    }
    case fromModelSettingsModalActions.GET_STRUCTURE_HAS_SETTINGS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'structureHasSettings', action.payload);
    }
    case fromModelSettingsModalActions.GET_STRUCTURE_HAS_SETTINGS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'structureHasSettings');
    }
    default:
      return state;
  }
}

export const getGradeModelSettingsModalOpen = (state: State) => state.gradeModalOpen;
export const getJobModelSettingsModalOpen = (state: State) => state.jobModalOpen;
export const getCurrenciesAsyncObj = (state: State) => state.currenciesAsyncObj;
export const getSurveyUdfsAsyncObj = (state: State) => state.surveyUdfsAsyncObj;
export const getControlPointsAsyncObj = (state: State) => state.controlPointsAsyncObj;
export const getStructureNameSuggestionsAsyncObj = (state: State) => state.structureNameSuggestionsAsyncObj;
export const getSavingModelSettingsAsyncObj = (state: State) => state.savingModelingSettingsAsyncObj;
export const getModelNameExistsFailure = (state: State) => state.modelNameExistsFailure;
export const getGradesDetails = (state: State) => state.gradesDetails;
export const getStructureHasSettings = (state: State) => state.structureHasSettings;
