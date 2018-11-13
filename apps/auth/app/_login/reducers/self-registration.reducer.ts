import * as fromSelfRegistrationActions from '../actions/self-registration.action';
import { SelfRegistrationForm } from 'libs/models/user/self-registration-form.model';

export interface State {
  selfRegistrationForm: SelfRegistrationForm;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: boolean;
}

export const initialState: State = {
  selfRegistrationForm: null,
  isSubmitting: false,
  submitSuccess: false,
  submitError: false,
};

export function reducer(state = initialState, action: fromSelfRegistrationActions.Actions): State {
  switch (action.type) {
    case fromSelfRegistrationActions.FIELD_CHANGE: {
      return {
        ...state,
        selfRegistrationForm: action.payload
      };
    }
    case fromSelfRegistrationActions.SUBMIT: {
      return {
        ...state,
        isSubmitting: true
      };
    }
    case fromSelfRegistrationActions.SUBMIT_SUCCESS: {
      return {
        ...state,
        isSubmitting: false,
        submitSuccess: true
      };
    }
    case fromSelfRegistrationActions.SUBMIT_ERROR: {
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

export const getSelfRegistrationForm = (state: State) => state.selfRegistrationForm;
export const getIsSubmitting = (state: State) => state.isSubmitting;
export const getSubmitSuccess = (state: State) => state.submitSuccess;
export const getSubmitError = (state: State) => state.submitError;
