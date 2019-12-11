import * as fromCustomFieldsActions from '../actions/custom-fields.actions';

export interface State {
  customJobFields: any ;
  customEmployeeFields: any;
  customFieldsError: boolean;
}

export const initialState: State = {
  customJobFields: null,
  customEmployeeFields: null,
  customFieldsError: false
};

export function reducer(state = initialState, action: fromCustomFieldsActions.Actions): State {
  switch (action.type) {
    case fromCustomFieldsActions.GET_CUSTOM_JOB_FIELDS: {
      return {
        ...state,
        customJobFields: null,
        customFieldsError: false
      };
    }
    case fromCustomFieldsActions.GET_CUSTOM_JOB_FIELDS_SUCCESS: {
      return {
        ...state,
        customJobFields: action.payload,
        customFieldsError: false
      };
    }
    case fromCustomFieldsActions.GET_CUSTOM_JOB_FIELDS_ERROR: {
      return {
        ...state,
        customJobFields: null,
        customFieldsError: true
      };
    }
    case fromCustomFieldsActions.GET_CUSTOM_EMPLOYEE_FIELDS: {
      return {
        ...state,
        customEmployeeFields: null,
        customFieldsError: false
      };
    }
    case fromCustomFieldsActions.GET_CUSTOM_EMPLOYEE_FIELDS_SUCCESS: {
      return {
        ...state,
        customEmployeeFields: action.payload,
        customFieldsError: false
      };
    }
    case fromCustomFieldsActions.GET_CUSTOM_EMPLOYEE_FIELDS_ERROR: {
      return {
        ...state,
        customEmployeeFields: null,
        customFieldsError: true
      };
    }

    default:
      return state;
  }
}

export const GetCustomJobFields = (state: State) => state.customJobFields;
export const GetCustomJobFieldsError = (state: State) => state.customFieldsError;
export const GetCustomEmployeeField = (state: State) => state.customEmployeeFields;
export const GetCustomEmployeeFieldError = (state: State) => state.customFieldsError;
