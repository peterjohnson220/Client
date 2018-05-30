import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromForgotPasswordReducer from './forgot-password.reducer';
import * as fromFirstLoginReducer from './first-login-reducer';

// Feature area state
export interface AuthMainState {
  forgotPassword: fromForgotPasswordReducer.State;
  firstLogin: fromFirstLoginReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  authMain: AuthMainState;
}

// Feature area reducers
export const reducers = {
  forgotPassword: fromForgotPasswordReducer.reducer,
  firstLogin: fromFirstLoginReducer.reducer
};

// Select Feature Area
export const selectAuthMainState = createFeatureSelector<AuthMainState>('authMain');

// Forgot password
export const forgotPasswordState =
  createSelector(selectAuthMainState, (state: AuthMainState) => state.forgotPassword);

export const getForgotPasswordSending =
  createSelector(forgotPasswordState, fromForgotPasswordReducer.getSendingPassword);
export const getForgotPasswordSuccess =
  createSelector(forgotPasswordState, fromForgotPasswordReducer.getSendingPasswordSuccess);
export const getForgotPasswordError =
  createSelector(forgotPasswordState, fromForgotPasswordReducer.getSendingPasswordResetError);

// First Login
export const firstLoginState =
  createSelector(selectAuthMainState, (state: AuthMainState) => state.firstLogin);

export const getValidatingFirstLogin =
  createSelector(firstLoginState, fromFirstLoginReducer.getValidatingFirstLogin);
export const getValidatingFirstLoginSuccess =
  createSelector(firstLoginState, fromFirstLoginReducer.getValidatingFirstLoginSuccess);
export const getValidatingFirstLoginError =
  createSelector(firstLoginState, fromFirstLoginReducer.getValidatingFirstLoginError);
export const getFirstLoginUpdatingPassword =
  createSelector(firstLoginState, fromFirstLoginReducer.getUpdatingPassword);
export const getFirstLoginUpdatingPasswordSuccess =
  createSelector(firstLoginState, fromFirstLoginReducer.getUpdatingPasswordSuccess);
export const getFirstLoginUpdatingPasswordError =
  createSelector(firstLoginState, fromFirstLoginReducer.getUpdatingPasswordError);
