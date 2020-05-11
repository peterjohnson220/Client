import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromCaptchaReducer from './captcha.reducer';

// Feature area state
export interface CaptchaState {
  captcha: fromCaptchaReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_captcha: CaptchaState;
}

// Feature area reducers
export const reducers = {
  captcha: fromCaptchaReducer.reducer
};

// Select feature area
export const selectFeatureAreaState =
  createFeatureSelector<CaptchaState>('feature_captcha');

// Selectors
export const selectCaptchaState = createSelector(
  selectFeatureAreaState,
  (state: CaptchaState) => state.captcha
);

// Captcha
export const getIsLoaded = createSelector(
  selectCaptchaState, fromCaptchaReducer.getIsLoaded
);

export const getSiteKeyAsyncObj = createSelector(
  selectCaptchaState, fromCaptchaReducer.getSiteKeyAsyncObj
);
