import * as fromCompanyControlActions from '../actions/company-controls-copy.actions';

export interface State {
    copying: boolean;
    copyingSuccess: boolean;
    copyingError: boolean;
    copyingErrorMessage: string;
}

const initialState: State = {
    copying: false,
    copyingSuccess: false,
    copyingError: false,
    copyingErrorMessage: ''
};

export function reducer(state = initialState, action: fromCompanyControlActions.CopyActions): State {
  switch (action.type) {
    case fromCompanyControlActions.COPY_COMPANY_CONTROL: {
        return {
          ...state,
          copying: true,
          copyingError: false,
          copyingErrorMessage: '',
          copyingSuccess: false
        };
      }
      case fromCompanyControlActions.COPY_COMPANY_CONTROL_SUCCESS: {
        return {
          ...state,
          copying: false,
          copyingError: false,
          copyingErrorMessage: '',
          copyingSuccess: true
        };
      }
      case fromCompanyControlActions.COPY_COMPANY_CONTROL_ERROR: {
        return {
          ...state,
          copying: false,
          copyingError: true,
          copyingErrorMessage: action.payload.errorMessage,
          copyingSuccess: false
        };
      }
    default:
      return state;
  }
}

export const getCopying = (state: State) => state.copying;
export const getCopyingSuccess = (state: State) => state.copyingSuccess;
export const getCopyingError = (state: State) => state.copyingError;
export const getCopyingErrorMessage = (state: State) => state.copyingErrorMessage;
