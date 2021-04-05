import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromServiceAccountReducer from './service-accounts.reducer';


// Feature area state
export interface ServiceAccountsFeatureState {
  serviceAccounts: fromServiceAccountReducer.State;
}

export interface State extends fromRoot.State {
  feature_serviceAccounts: ServiceAccountsFeatureState;
}

export const reducers = {
  serviceAccounts: fromServiceAccountReducer.reducer
};

// Select Feature Area
export const selectFeatureAreaState = createFeatureSelector<ServiceAccountsFeatureState>('feature_serviceAccounts');

// Feature Selectors
export const ServiceAccountsState = createSelector(
  selectFeatureAreaState,
  (state: ServiceAccountsFeatureState) => state.serviceAccounts);

// General Service Account selectors
export const getAccountStatus = createSelector(
  ServiceAccountsState,
  fromServiceAccountReducer.GetAccountStatus
);

export const getAccountStatusLoading = createSelector(
  ServiceAccountsState,
  fromServiceAccountReducer.GetAccountStatusLoading
);

export const getAccountStatusLoadingError = createSelector(
  ServiceAccountsState,
  fromServiceAccountReducer.GetAccountStatusLoadingError
);

export const getCreatingServiceAccount = createSelector(
  ServiceAccountsState,
  fromServiceAccountReducer.GetCreatingServiceAccount
);

export const getCreatingServiceAccountError = createSelector(
  ServiceAccountsState,
  fromServiceAccountReducer.GetCreatingServiceAccountError
);

export const getResettingServiceAccount = createSelector(
  ServiceAccountsState,
  fromServiceAccountReducer.GetResettingServiceAccount
);

export const getResettingServiceAccountError = createSelector(
  ServiceAccountsState,
  fromServiceAccountReducer.GetResettingServiceAccountError
);

export const getServiceAccountUser = createSelector(
  ServiceAccountsState,
  fromServiceAccountReducer.GetServiceAccountUser
);
