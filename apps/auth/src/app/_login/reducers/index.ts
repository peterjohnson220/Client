import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromForgotPasswordReducer from './forgot-password.reducer';

// Feature area state
export interface AuthMainState {
  forgotPassword: fromForgotPasswordReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  authMain: AuthMainState;
}

// Feature area reducers
export const reducers = {
  forgotPassword: fromForgotPasswordReducer.reducer
};

// Select Feature Area
export const selectAuthMainState = createFeatureSelector<AuthMainState>('authMain');
export const forgotPasswordState = createSelector(selectAuthMainState, (state: AuthMainState) => state.forgotPassword);

export const getForgotPasswordSending = createSelector(forgotPasswordState, fromForgotPasswordReducer.getSendingPassword);
export const getForgotPasswordSuccess = createSelector(forgotPasswordState, fromForgotPasswordReducer.getSendingPasswordSuccess);
export const getForgotPasswordError = createSelector(forgotPasswordState, fromForgotPasswordReducer.getSendingPasswordResetError);
