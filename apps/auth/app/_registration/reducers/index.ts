import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromRegistrationFormReducer from './registration-form.reducer';
import * as fromValidateRegistrationReducer from './validate-registration.reducer';
import * as fromCompleteRegistrationReducer from './complete-registration.reducer';

// Feature area state
export interface RegistrationState {
  registrationForm: fromRegistrationFormReducer.State;
  validateRegistration: fromValidateRegistrationReducer.State;
  completeRegistration: fromCompleteRegistrationReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  registration: RegistrationState;
}

// Feature area reducers
export const reducers = {
  registrationForm: fromRegistrationFormReducer.reducer,
  validateRegistration: fromValidateRegistrationReducer.reducer,
  completeRegistration: fromCompleteRegistrationReducer.reducer
};

// Select Feature Area
export const selectRegistrationState = createFeatureSelector<RegistrationState>('registration');


// Registration Form
export const registrationFormState =
  createSelector(selectRegistrationState, (state: RegistrationState) => state.registrationForm);

export const getRegistrationForm =
  createSelector(registrationFormState, fromRegistrationFormReducer.getRegistrationForm);
export const getRegistrationFormIsSubmitting =
  createSelector(registrationFormState, fromRegistrationFormReducer.getIsSubmitting);
export const getRegistrationFormSubmitSuccess =
  createSelector(registrationFormState, fromRegistrationFormReducer.getSubmitSuccess);
export const getRegistrationFormSubmitError =
  createSelector(registrationFormState, fromRegistrationFormReducer.getSubmitError);

// Complete Registration
export const completeRegistrationState =
  createSelector(selectRegistrationState, (state: RegistrationState) => state.completeRegistration);

export const getCompleteRegistrationIsSubmitting =
  createSelector(completeRegistrationState, fromCompleteRegistrationReducer.getIsSubmitting);
export const getCompleteRegistrationSubmitSuccess =
  createSelector(completeRegistrationState, fromCompleteRegistrationReducer.getSubmitSuccess);
export const getCompleteRegistrationSubmitError =
  createSelector(completeRegistrationState, fromCompleteRegistrationReducer.getSubmitError);

// Validate Registration
export const validateRegistrationState =
  createSelector(selectRegistrationState, (state: RegistrationState) => state.validateRegistration);

export const getValidatingToken =
  createSelector(validateRegistrationState, fromValidateRegistrationReducer.getValidatingToken);
export const getValidatingTokenSuccess =
  createSelector(validateRegistrationState, fromValidateRegistrationReducer.getValidatingTokenSuccess);
export const getValidatingTokenError =
  createSelector(validateRegistrationState, fromValidateRegistrationReducer.getValidatingTokenError);
export const getValidatingTokenExpired =
  createSelector(validateRegistrationState, fromValidateRegistrationReducer.getValidatingTokenExpired);
export const getValidatingTokenAccountExists =
  createSelector(validateRegistrationState, fromValidateRegistrationReducer.getValidatingTokenAccountExists);
export const getValidatedToken =
  createSelector(validateRegistrationState, fromValidateRegistrationReducer.getValidatedToken);
export const getValidatingTokenExistingCompany =
  createSelector(validateRegistrationState, fromValidateRegistrationReducer.getValidatingTokenExistingCompany);
export const getResendingToken =
  createSelector(validateRegistrationState, fromValidateRegistrationReducer.getResendingToken);
export const getResendingTokenSuccess =
  createSelector(validateRegistrationState, fromValidateRegistrationReducer.getResendingTokenSuccess);
export const getResendingTokenError =
  createSelector(validateRegistrationState, fromValidateRegistrationReducer.getResendingTokenError);
export const getAccountEmail =
  createSelector(validateRegistrationState, fromValidateRegistrationReducer.getAccountEmail);
