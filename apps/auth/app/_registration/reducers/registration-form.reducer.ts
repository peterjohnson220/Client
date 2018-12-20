import * as fromRegistrationFormActions from '../actions/registration-form.actions';
import { RegistrationForm } from 'libs/models/user/registration-form.model';

export interface State {
  registrationForm: RegistrationForm;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: boolean;
}

export const initialState: State = {
  registrationForm: null,
  isSubmitting: false,
  submitSuccess: false,
  submitError: false
};

export function reducer(state = initialState, action: fromRegistrationFormActions.Actions): State {
  switch (action.type) {
    case fromRegistrationFormActions.SUBMIT: {
      return {
        ...state,
        isSubmitting: true
      };
    }
    case fromRegistrationFormActions.SUBMIT_SUCCESS: {
      return {
        ...state,
        isSubmitting: false,
        submitSuccess: true
      };
    }
    case fromRegistrationFormActions.SUBMIT_ERROR: {
      return {
        ...state,
        isSubmitting: false,
        submitError: true
      };
    }
    case fromRegistrationFormActions.FIELD_CHANGE: {
      return {
        ...state,
        registrationForm: action.payload
      };
    }
    case fromRegistrationFormActions.CLEAR_FORM: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getRegistrationForm = (state: State) => state.registrationForm;
export const getIsSubmitting = (state: State) => state.isSubmitting;
export const getSubmitSuccess = (state: State) => state.submitSuccess;
export const getSubmitError = (state: State) => state.submitError;
