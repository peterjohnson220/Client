import * as fromCompleteRegistrationActions from '../actions/complete-registration.actions';

export interface State {
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: boolean;
}

export const initialState: State = {
  isSubmitting: false,
  submitSuccess: false,
  submitError: false
};

export function reducer(state = initialState, action: fromCompleteRegistrationActions.Actions): State {
  switch (action.type) {
    case fromCompleteRegistrationActions.SUBMIT: {
      return {
        ...state,
        isSubmitting: true
      };
    }
    case fromCompleteRegistrationActions.SUBMIT_SUCCESS: {
      return {
        ...state,
        isSubmitting: false,
        submitSuccess: true
      };
    }
    case fromCompleteRegistrationActions.SUBMIT_ERROR: {
      return {
        ...state,
        isSubmitting: false,
        submitError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getIsSubmitting = (state: State) => state.isSubmitting;
export const getSubmitSuccess = (state: State) => state.submitSuccess;
export const getSubmitError = (state: State) => state.submitError;
