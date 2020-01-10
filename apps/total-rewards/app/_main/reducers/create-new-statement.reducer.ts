import * as fromCreateNewStatementActions from '../actions/create-new-statement.actions';

export interface State {
  name: string;
  templateId: number;
  isCreating: boolean;
  isCreatingError: boolean;
  isValidName: boolean;
  isValidatingName: boolean;
  isValidatingNameError: boolean;
}

const initialState: State = {
  name: null,
  templateId: null,
  isCreating: false,
  isCreatingError: false,
  isValidName: false,
  isValidatingName: false,
  isValidatingNameError: false,
};

export function reducer(state = initialState, action: fromCreateNewStatementActions.Actions): State {
  switch (action.type) {
    case fromCreateNewStatementActions.RESET_FORM: {
      return {
        ...initialState
      };
    }
    case fromCreateNewStatementActions.UPDATE_NAME: {
      return {
        ...state,
        name: action.payload
      };
    }
    case fromCreateNewStatementActions.UPDATE_TEMPLATE: {
      return {
        ...state,
        templateId: action.payload
      };
    }
    case fromCreateNewStatementActions.VALIDATE_STATEMENT_NAME: {
      return {
        ...state,
        isValidatingName: true,
        isValidatingNameError: false,
      };
    }
    case fromCreateNewStatementActions.VALIDATE_STATEMENT_NAME_SUCCESS: {
      return {
        ...state,
        isValidatingName: false,
        isValidatingNameError: false,
        isValidName: action.payload
      };
    }
    case fromCreateNewStatementActions.VALIDATE_STATEMENT_NAME_ERROR: {
      return {
        ...state,
        isValidatingName: false,
        isValidatingNameError: true,
      };
    }
    case fromCreateNewStatementActions.CREATE: {
      return {
        ...state,
        isCreating: true,
        isCreatingError: false,
      };
    }
    case fromCreateNewStatementActions.CREATE_SUCCESS: {
      return {
        ...state,
        isCreating: false,
        isCreatingError: false,
      };
    }
    case fromCreateNewStatementActions.CREATE_ERROR: {
      return {
        ...state,
        isCreating: false,
        isCreatingError: true,
      };
    }
    default: {
      return state;
    }
  }
}

export const getName = (state: State) => state.name;
export const getTemplateId = (state: State) => state.templateId;

export const getIsCreating = (state: State) => state.isCreating;
export const getIsCreatingError = (state: State) => state.isCreatingError;

export const getIsValidName = (state: State) => state.isValidName;
export const getIsValidatingName = (state: State) => state.isValidatingName;
export const getIsValidatingNameSuccess = (state: State) => state.isValidatingNameError;
