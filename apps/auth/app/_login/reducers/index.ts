import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromForgotPasswordReducer from './forgot-password.reducer';
import * as fromFirstLoginReducer from './first-login-reducer';
import * as fromResetPasswordReducer from './reset-password.reducer';
import * as fromMarketingReducer from './marketing-image.reducer';
import * as fromLoginReducer from './login.reducer';

// Feature area state
export interface AuthMainState {
  forgotPassword: fromForgotPasswordReducer.State;
  resetPassword: fromResetPasswordReducer.State;
  firstLogin: fromFirstLoginReducer.State;
  marketingImage: fromMarketingReducer.State;
  login: fromLoginReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  authMain: AuthMainState;
}

// Feature area reducers
export const reducers = {
  forgotPassword: fromForgotPasswordReducer.reducer,
  resetPassword: fromResetPasswordReducer.reducer,
  firstLogin: fromFirstLoginReducer.reducer,
  marketingImage: fromMarketingReducer.reducer,
  login: fromLoginReducer.reducer
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

// Reset Password
export const resetPasswordState =
  createSelector(selectAuthMainState, (state: AuthMainState) => state.resetPassword);

export const getResettingPassword =
  createSelector(resetPasswordState, fromResetPasswordReducer.getResettingPassword);
export const getResetPasswordSuccess =
  createSelector(resetPasswordState, fromResetPasswordReducer.getResettingPasswordSuccess);
export const getResetPasswordTokenExpired =
  createSelector(resetPasswordState, fromResetPasswordReducer.getResettingPasswordTokenExpired);
export const getResetPasswordAlreadyUsed =
  createSelector(resetPasswordState, fromResetPasswordReducer.getResettingPasswordAlreadyUsed);
export const getResetPasswordError =
  createSelector(resetPasswordState, fromResetPasswordReducer.getResettingPasswordError);
export const getCheckingResetPasswordToken =
  createSelector(resetPasswordState, fromResetPasswordReducer.getCheckingResetPasswordToken);
export const getCheckingResetPasswordTokenSuccess =
  createSelector(resetPasswordState, fromResetPasswordReducer.getCheckingResetPasswordTokenSuccess);
export const getPasswordMinimumLength =
  createSelector(resetPasswordState, fromResetPasswordReducer.getPasswordMinimumLength);
export const getUsername =
  createSelector(resetPasswordState, fromResetPasswordReducer.getUsername);


// marketing
export const getMarketingState =
  createSelector(selectAuthMainState, (state: AuthMainState) => state.marketingImage);

export const getMarketingImage =
  createSelector(getMarketingState, fromMarketingReducer.getMarketingImage);
export const getGettingMarketingImage =
  createSelector(getMarketingState, fromMarketingReducer.getGettingMarketingImage);
export const getGettingMarketingImageError =
  createSelector(getMarketingState, fromMarketingReducer.getGettingMarketingImageError);
export const getGettingMarketingImageSuccess =
  createSelector(getMarketingState, fromMarketingReducer.getGettingMarketingImageSuccess);

// login
export const loginState =
  createSelector(selectAuthMainState, (state: AuthMainState) => state.login);

export const getLogin =
  createSelector(loginState, fromLoginReducer.getLogin);
export const getLoginSuccess =
  createSelector(loginState, fromLoginReducer.getLoginSuccess);
export const getLoginError =
  createSelector(loginState, fromLoginReducer.getLoginError);
export const getPasswordExpired =
  createSelector(loginState, fromLoginReducer.getPasswordExpired);

// login settings
export const getLoginSettingsSuccess =
  createSelector(loginState, fromLoginReducer.getLoginSettingsSuccess);
export const getLoginSettings =
  createSelector(loginState, fromLoginReducer.getLoginSettings);
