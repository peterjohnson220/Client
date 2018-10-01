import { createSelector, createFeatureSelector, ActionReducerMap } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from '../../shared/state';

// Import feature reducers
import * as fromLoginReducer from './login.reducer';

// Feature area state
export interface LoginAreaState {
    login: fromLoginReducer.State;
}

// Extend root state with feature state
export interface State extends fromRoot.AppState {
    loginArea: LoginAreaState;
}

export const reducers: ActionReducerMap<LoginAreaState> = {
    login: fromLoginReducer.reducer
};

export const selectFeatureAreaState = createFeatureSelector<LoginAreaState>('loginArea');

export const selectLoginState = createSelector(selectFeatureAreaState, (loginArea: LoginAreaState) => loginArea.login);
export const selectIsLoggingIn = createSelector(selectLoginState, fromLoginReducer.getIsLoggingIn);
export const selectLoginSuccess = createSelector(selectLoginState, fromLoginReducer.getLoginSuccess);
export const selectLoginFailure = createSelector(selectLoginState, fromLoginReducer.getLoginFailure);
