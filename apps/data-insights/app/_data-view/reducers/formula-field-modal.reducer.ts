import * as fromFormulaFieldActions from '../actions/formula-field-modal.actions';

export interface State {
  validating: boolean;
  formulaValid: boolean;
  saving: boolean;
  savingSuccess: boolean;
  savingError: boolean;
  savingErrorMessage: string;
}

const initialState: State = {
  validating: false,
  formulaValid: false,
  saving: false,
  savingSuccess: false,
  savingError: false,
  savingErrorMessage: ''
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
        formulaValid: action.payload.result
      };
    }
    case fromFormulaFieldActions.VALIDATE_FORMULA_ERROR: {
      return {
        ...state,
        validating: false
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
