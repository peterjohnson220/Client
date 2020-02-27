import * as fromRoot from 'libs/state/state';
import * as fromSsoConfigReducer from './sso-config.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface SsoState {
  ssoConfig: fromSsoConfigReducer.State;
}

export interface State extends fromRoot.State {
    sso: SsoState;
}

export const reducers = {
  ssoConfig: fromSsoConfigReducer.reducer
};

export const selectFeatureAreaState = createFeatureSelector<SsoState>('sso');

export const selectSsoState = createSelector(
  selectFeatureAreaState,
  (state: SsoState) => state.ssoConfig
);

export const getSsoConfiguring = createSelector(
  selectSsoState,
  fromSsoConfigReducer.getSsoConfiguring
);

export const getSsoConfiguringSuccess = createSelector(
  selectSsoState,
  fromSsoConfigReducer.getSsoConfiguringSuccess
);

export const getSsoConfiguringError = createSelector(
  selectSsoState,
  fromSsoConfigReducer.getSsoConfiguringError
);

export const getAddSsoConfigModalOpen = createSelector(
  selectSsoState,
  fromSsoConfigReducer.getAddSsoConfigModalOpen
);

export const getSsoConfigList =  createSelector(
  selectSsoState,
  fromSsoConfigReducer.getSsoConfigList
);

export const getSsoConfigLoading = createSelector(
  selectSsoState,
  fromSsoConfigReducer.getSsoConfigLoading
);

export const getSsoConfigLoadingSuccess = createSelector(
  selectSsoState,
  fromSsoConfigReducer.getSsoConfigLoadingSuccess
);

export const getSsoConfigLoadingError = createSelector(
  selectSsoState,
  fromSsoConfigReducer.getSsoConfigLoadingError
);

