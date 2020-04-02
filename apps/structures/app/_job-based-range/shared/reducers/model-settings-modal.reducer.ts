import * as fromModelSettingsModalActions from '../actions/model-settings-modal.actions';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import { Currency, ControlPoint } from '../models';

export interface State {
  modalOpen: boolean;
  currenciesAsyncObj: AsyncStateObj<Currency[]>;
  controlPointsAsyncObj: AsyncStateObj<ControlPoint[]>;
  structureNameSuggestionsAsyncObj: AsyncStateObj<string[]>;
  savingModelingSettingsAsyncObj: AsyncStateObj<any>;
  modelNameExistsFailure: boolean;
}

const initialState: State = {
  modalOpen: false,
  currenciesAsyncObj: generateDefaultAsyncStateObj<Currency[]>([]),
  controlPointsAsyncObj: generateDefaultAsyncStateObj<ControlPoint[]>([]),
  structureNameSuggestionsAsyncObj: generateDefaultAsyncStateObj<string[]>([]),
  savingModelingSettingsAsyncObj: generateDefaultAsyncStateObj<any>(null),
  modelNameExistsFailure: false
};

export function reducer(state = initialState, action: fromModelSettingsModalActions.ModelSettingsModalActions): State {
  switch (action.type) {
    case fromModelSettingsModalActions.OPEN_MODAL:
      return {
        ...state,
        modalOpen: true
      };
    case fromModelSettingsModalActions.CLOSE_MODAL:
      return {
        ...state,
        modalOpen: false
      };
    case fromModelSettingsModalActions.GET_CURRENCIES:
      return AsyncStateObjHelper.loading(state, 'currenciesAsyncObj');
    case fromModelSettingsModalActions.GET_CURRENCIES_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'currenciesAsyncObj', action.payload);
    case fromModelSettingsModalActions.GET_CURRENCIES_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'currenciesAsyncObj');
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
    case fromModelSettingsModalActions.SAVE_MODEL_SETTINGS:
      return AsyncStateObjHelper.saving(state, 'savingModelingSettingsAsyncObj');
    case fromModelSettingsModalActions.SAVE_MODEL_SETTINGS_SUCCESS:
      return AsyncStateObjHelper.savingSuccess(state, 'savingModelingSettingsAsyncObj');
    case fromModelSettingsModalActions.SAVE_MODEL_SETTINGS_ERROR:
      return AsyncStateObjHelper.savingError(state, 'savingModelingSettingsAsyncObj');
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
    default:
      return state;
  }
}

export const getModalOpen = (state: State) => state.modalOpen;
export const getCurrenciesAsyncObj = (state: State) => state.currenciesAsyncObj;
export const getControlPointsAsyncObj = (state: State) => state.controlPointsAsyncObj;
export const getStructureNameSuggestionsAsyncObj = (state: State) => state.structureNameSuggestionsAsyncObj;
export const getSavingModelSettingsAsyncObj = (state: State) => state.savingModelingSettingsAsyncObj;
export const getModelNameExistsFailure = (state: State) => state.modelNameExistsFailure;
