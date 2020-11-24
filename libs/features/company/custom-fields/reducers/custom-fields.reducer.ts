import * as fromCustomFieldsActions from '../actions/custom-fields.actions';

export interface State {
  customJobFields: any;
  customEmployeeFields: any;
  customFieldsError: boolean;
  tagCategories: any;
}

export const initialState: State = {
  customJobFields: null,
  customEmployeeFields: null,
  customFieldsError: false,
  tagCategories: null,
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
    case fromCustomFieldsActions.GET_TAGCATEGORIES: {
      return {
        ...state,
        tagCategories: null,
        customFieldsError: false
      };
    }
    case fromCustomFieldsActions.GET_TAGCATEGORIES_SUCCESS: {
      return {
        ...state,
        tagCategories: action.payload,
        customFieldsError: false
      };
    }
    case fromCustomFieldsActions.GET_TAGCATEGORIES_ERROR: {
      return {
        ...state,
        tagCategories: null,
        customFieldsError: true
      };
    }

    default:
      return state;
  }
}

export const GetCustomJobFields = (state: State) => state.customJobFields;
export const GetCustomEmployeeFields = (state: State) => state.customEmployeeFields;
export const GetTagCategories = (state: State) => state.tagCategories;
export const GetCustomFieldsError = (state: State) => state.customFieldsError;
