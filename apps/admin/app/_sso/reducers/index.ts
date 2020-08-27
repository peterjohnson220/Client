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

export const getSsoConfigModalOpen = createSelector(
  selectSsoState,
  fromSsoConfigReducer.getSsoConfigModalOpen
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

export const getSelectedCustomerConnection = createSelector(
  selectSsoState,
  fromSsoConfigReducer.getSelectedCustomerConnection
);

export const getCustomerConnectionSelected = createSelector(
  selectSsoState,
  fromSsoConfigReducer.getCustomerConnectionSelected
);

export const getUpdatingConfiguration = createSelector(
  selectSsoState,
  fromSsoConfigReducer.getUpdatingConfiguration
);

export const getUpdatingConfigurationSuccess = createSelector(
  selectSsoState,
  fromSsoConfigReducer.getUpdatingConfigurationSuccess
);
