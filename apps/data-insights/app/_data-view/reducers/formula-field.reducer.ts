import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import * as fromFormulaFieldActions from 'libs/features/formula-editor/actions/formula-field.actions';
import { FieldDataType } from 'libs/features/formula-editor';


export interface State {
  validating: boolean;
  formulaValid: boolean;
  saving: boolean;
  savingSuccess: boolean;
  savingError: boolean;
  savingErrorMessage: string;
  formulaDataType: FieldDataType;
  formulaViewCount: AsyncStateObj<number>;
}

const initialState: State = {
  validating: false,
  formulaValid: false,
  saving: false,
  savingSuccess: false,
  savingError: false,
  savingErrorMessage: '',
  formulaDataType: null,
  formulaViewCount: generateDefaultAsyncStateObj<number>(0)
};

export function reducer(state = initialState, action: fromFormulaFieldActions.Actions): State {
  switch (action.type) {
    case fromFormulaFieldActions.VALIDATE_FORMULA: {
      return {
        ...state,
        validating: true
      };
    }
    case fromFormulaFieldActions.VALIDATE_FORMULA_SUCCESS: {
      return {
        ...state,
        validating: false,
        formulaValid: action.payload.result,
        formulaDataType: action.payload.dataType
      };
    }
    case fromFormulaFieldActions.VALIDATE_FORMULA_ERROR: {
      return {
        ...state,
        validating: false,
        formulaValid: false,
        formulaDataType: null
      };
    }
    case fromFormulaFieldActions.SAVE_FORMULA_FIELD: {
      return {
        ...state,
        saving: true,
        savingSuccess: false,
        savingError: false,
        savingErrorMessage: ''
      };
    }
    case fromFormulaFieldActions.CREATE_FORMULA_FIELD_SUCCESS:
    case fromFormulaFieldActions.UPDATE_FORMULA_FIELD_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingSuccess: true
      };
    }
    case fromFormulaFieldActions.SAVE_FORMULA_FIELD_ERROR: {
      return {
        ...state,
        saving: false,
        savingError: true,
        savingErrorMessage: action.payload.message
      };
    }
    case fromFormulaFieldActions.RESET_MODAL: {
      return {
        ...state,
        savingErrorMessage: ''
      };
    }
    case fromFormulaFieldActions.GET_FORMULA_FIELD_VIEW_COUNT: {
      const viewCountAsyncClone = cloneDeep(state.formulaViewCount);
      viewCountAsyncClone.loading = true;
      viewCountAsyncClone.loadingError = false;
      viewCountAsyncClone.obj = 0;
      return {
        ...state,
        formulaViewCount: viewCountAsyncClone
      };
    }
    case fromFormulaFieldActions.GET_FORMULA_FIELD_VIEW_COUNT_ERROR: {
      const viewCountAsyncClone = cloneDeep(state.formulaViewCount);
      viewCountAsyncClone.loading = false;
      viewCountAsyncClone.loadingError = true;
      return {
        ...state,
        formulaViewCount: viewCountAsyncClone
      };
    }
    case fromFormulaFieldActions.GET_FORMULA_FIELD_VIEW_COUNT_SUCCESS: {
      const viewCountAsyncClone = cloneDeep(state.formulaViewCount);
      viewCountAsyncClone.loading = false;
      viewCountAsyncClone.obj = action.payload;
      return {
        ...state,
        formulaViewCount: viewCountAsyncClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getValidating = (state: State) => state.validating;
export const getFormulaValid = (state: State) => state.formulaValid;
export const getSaving = (state: State) => state.saving;
export const getSavingSuccess = (state: State) => state.savingSuccess;
export const getSavingError = (state: State) => state.savingError;
export const getSavingErrorMessage = (state: State) => state.savingErrorMessage;
export const getFormulaDataType = (state: State) => state.formulaDataType;
export const getFormulaViewCount = (state: State) => state.formulaViewCount;
