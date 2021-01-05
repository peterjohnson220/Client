import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import * as fromFormulaFieldActions from 'libs/ui/formula-editor/actions/formula-field.actions';
import { FieldDataType, Field, PayfactorsApiModelMapper } from 'libs/ui/formula-editor';


export interface FormulaFieldState {
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

export interface State {
  fields: { [key: string]: FormulaFieldState};
}

const INITIAL_STATE: State = {
  fields: {}
};

export function reducer(state = INITIAL_STATE, action: fromFormulaFieldActions.Actions): State {
  switch (action.type) {
    case fromFormulaFieldActions.WAIT_FOR_FORMULA_VALIDATION: {
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.formulaFieldId]: {
            ...state.fields[action.payload.formulaFieldId],
            waitingForValidation: true,
            resetFormula: false
          }
        }
      };
    }
    case fromFormulaFieldActions.VALIDATE_FORMULA: {
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.formulaFieldId]: {
            ...state.fields[action.payload.formulaFieldId],
            waitingForValidation: false,
            validating: true,
            formulaValid: false
          }
        }
      };
    }
    case fromFormulaFieldActions.VALIDATE_FORMULA_SUCCESS: {
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.formulaFieldId]: {
            ...state.fields[action.payload.formulaFieldId],
            validating: false,
            formulaValid: action.payload.result,
            formulaDataType: action.payload.dataType
          }
        }
      };
    }
    case fromFormulaFieldActions.VALIDATE_FORMULA_ERROR: {
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.formulaFieldId]: {
            ...state.fields[action.payload.formulaFieldId],
            validating: false,
            formulaValid: false,
            formulaDataType: null
          }
        }
      };
    }
    case fromFormulaFieldActions.SAVE_FORMULA_FIELD: {
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.formulaFieldId]: {
            ...state.fields[action.payload.formulaFieldId],
            saving: true,
            savingSuccess: false,
            savingError: false,
            savingErrorMessage: ''
          }
        }
      };
    }
    case fromFormulaFieldActions.CREATE_FORMULA_FIELD_SUCCESS:
    case fromFormulaFieldActions.UPDATE_FORMULA_FIELD_SUCCESS: {
      const field: Field = PayfactorsApiModelMapper.mapDataViewFieldToField(action.payload.dataViewField);
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.formulaFieldId]: {
            ...state.fields[action.payload.formulaFieldId],
            saving: false,
            savingSuccess: true,
            formulaField: field
          }
        }
      };
    }
    case fromFormulaFieldActions.SAVE_FORMULA_FIELD_ERROR: {
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.formulaFieldId]: {
            ...state.fields[action.payload.formulaFieldId],
            saving: false,
            savingError: true,
            savingErrorMessage: action.payload.message
          }
        }
      };
    }
    case fromFormulaFieldActions.RESET_MODAL: {
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.formulaFieldId]: {
            ...state.fields[action.payload.formulaFieldId],
            savingErrorMessage: ''
          }
        }
      };
    }
    case fromFormulaFieldActions.RESET_FORMULA: {
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.formulaFieldId]: {
            ...state.fields[action.payload.formulaFieldId],
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
          }
        }
      };
    }
    default: {
      return state;
    }
  }
}

export const getWaitingForValidation = (state: State, formulaFieldId: string) =>
  state.fields[formulaFieldId] ? state.fields[formulaFieldId].waitingForValidation : null;
export const getValidating = (state: State, formulaFieldId: string) => state.fields[formulaFieldId] ? state.fields[formulaFieldId].validating : null;
export const getFormulaValid = (state: State, formulaFieldId: string) => state.fields[formulaFieldId] ? state.fields[formulaFieldId].formulaValid : null;
export const getSaving = (state: State, formulaFieldId: string) => state.fields[formulaFieldId] ? state.fields[formulaFieldId].saving : null;
export const getSavingSuccess = (state: State, formulaFieldId: string) => state.fields[formulaFieldId] ? state.fields[formulaFieldId].savingSuccess : null;
export const getSavingError = (state: State, formulaFieldId: string) => state.fields[formulaFieldId] ? state.fields[formulaFieldId].savingError : null;
export const getSavingErrorMessage = (state: State, formulaFieldId: string) =>
  state.fields[formulaFieldId] ? state.fields[formulaFieldId].savingErrorMessage : null;
export const getFormulaDataType = (state: State, formulaFieldId: string) => state.fields[formulaFieldId] ? state.fields[formulaFieldId].formulaDataType : null;
export const getFormulaField = (state: State, formulaFieldId: string) => state.fields[formulaFieldId] ? state.fields[formulaFieldId].formulaField : null;
export const getResetFormula = (state: State, formulaFieldId: string) => state.fields[formulaFieldId] ? state.fields[formulaFieldId].resetFormula : null;
export const getAllFields = (state: State) => state.fields;
