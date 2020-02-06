// import { StructureRangeGroupResponse } from 'libs/models/payfactors-api/structures';
import { CompanyStructure } from 'libs/models/structures/company-structure.model';

import * as fromJobRangeModelingPageActions from '../actions/job-range-modeling-page.actions';

export interface State {
  structureLoadedFromServerComplete: boolean;
  currentModel: any;
  isEditModelNameLoading: boolean;
  editModelNameError: string;
  currentStructure: CompanyStructure;
}

const initialState: State = {
  structureLoadedFromServerComplete: false,
  currentModel: null,
  isEditModelNameLoading: false,
  editModelNameError: null,
  currentStructure: null
};

// Reducer function
export function reducer(state: State = initialState, action: fromJobRangeModelingPageActions.Actions) {
  switch (action.type) {
    case fromJobRangeModelingPageActions.GET_MODEL_DATA: {
      return {
        ...state
      };
    }
    case fromJobRangeModelingPageActions.GET_MODEL_DATA_SUCCESS: {
      return {
        ...state,
        currentModel: action.payload
      };
    }
    case fromJobRangeModelingPageActions.SET_CURRENT_MODEL: {
      return {
        ...state,
        currentModel: action.payload
      };
    }
    case fromJobRangeModelingPageActions.GET_STRUCTURE_DATA: {
      return {
        ...state
      };
    }
    case fromJobRangeModelingPageActions.GET_STRUCTURE_DATA_SUCCESS: {
      return {
        ...state,
        structureLoadedFromServerComplete: true,
        currentStructure: action.payload
      };
    }
    case fromJobRangeModelingPageActions.SET_CURRENT_STRUCTURE: {
      return (state.structureLoadedFromServerComplete) ?
        state : {
          ...state,
          currentStructure: action.payload
        };
    }
    case fromJobRangeModelingPageActions.UPDATE_CURRENT_COMPANY_STRUCTURE_RANGE_GROUP_NAME: {
      return {
        ...state,
        isEditModelNameLoading: true
      };
    }
    case fromJobRangeModelingPageActions.UPDATE_CURRENT_COMPANY_STRUCTURE_RANGE_GROUP_NAME_SUCCESS: {
      return {
        ...state,
        currentModel: action.payload,
        isEditModelNameLoading: false
      };
    }
    case fromJobRangeModelingPageActions.UPDATE_CURRENT_COMPANY_STRUCTURE_RANGE_GROUP_NAME_ERROR: {
      return {
        ...state,
        editModelNameError: action.payload,
        isEditModelNameLoading: false
      };
    }
    case fromJobRangeModelingPageActions.CLEAR_EDIT_MODEL_NAME_ERROR: {
      return {
        ...state,
        editModelNameError: null
      };
    }
    default:
      return state;
  }
}

// Selector functions
export const getCurrentModel = (state: State) => state.currentModel;
export const getCurrentStructure = (state: State) => state.currentStructure;
export const getIsEditModelNameLoading = (state: State) => state.isEditModelNameLoading;
export const getEditModelNameError = (state: State) => state.editModelNameError;
