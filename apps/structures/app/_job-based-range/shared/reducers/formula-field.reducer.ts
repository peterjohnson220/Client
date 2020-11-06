import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import * as fromFormulaFieldActions from 'libs/features/formula-editor/actions/formula-field.actions';
import { FieldDataType, Field, PayfactorsApiModelMapper } from 'libs/features/formula-editor';


export interface State {
  waitingForValidation: boolean;
  validating: boolean;
  formulaValid: boolean;
  saving: boolean;
  savingSuccess: boolean;
  savingError: boolean;
  savingErrorMessage: string;
  formulaDataType: FieldDataType;
  formulaViewCount: AsyncStateObj<number>;
  formulaField: Field;
  resetFormula: boolean;
}

const initialState: State = {
  waitingForValidation: false,
  validating: false,
  formulaValid: false,
  saving: false,
  savingSuccess: false,
  savingError: false,
  savingErrorMessage: '',
  formulaDataType: null,
  formulaViewCount: generateDefaultAsyncStateObj<number>(0),
  formulaField: null,
  resetFormula: false
};

export function reducer(state = initialState, action: fromFormulaFieldActions.Actions): State {
  switch (action.type) {
    case fromFormulaFieldActions.WAIT_FOR_FORMULA_VALIDATION: {
      return {
        ...state,
        waitingForValidation: true,
        resetFormula: false
      };
    }
    case fromFormulaFieldActions.VALIDATE_FORMULA: {
      return {
        ...state,
        waitingForValidation: false,
        validating: true,
        formulaValid: false
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
      const field: Field = PayfactorsApiModelMapper.mapDataViewFieldToField(action.payload);
      return {
        ...state,
        saving: false,
        savingSuccess: true,
        formulaField: field
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
    case fromFormulaFieldActions.RESET_FORMULA: {
      return {
        ...state,
        waitingForValidation: false,
        validating: false,
        formulaValid: false,
        saving: false,
        savingSuccess: false,
        savingError: false,
        savingErrorMessage: '',
        formulaDataType: null,
        formulaViewCount: generateDefaultAsyncStateObj<number>(0),
        formulaField: null,
        resetFormula: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getWaitingForValidation = (state: State) => state.waitingForValidation;
export const getValidating = (state: State) => state.validating;
export const getFormulaValid = (state: State) => state.formulaValid;
export const getSaving = (state: State) => state.saving;
export const getSavingSuccess = (state: State) => state.savingSuccess;
export const getSavingError = (state: State) => state.savingError;
export const getSavingErrorMessage = (state: State) => state.savingErrorMessage;
export const getFormulaDataType = (state: State) => state.formulaDataType;
export const getFormulaField = (state: State) => state.formulaField;
export const getResetFormula = (state: State) => state.resetFormula;
