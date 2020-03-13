import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromPasswordSettingsReducer from './security-setting.reducer';

// Feature area state
export interface CompanyAdminPasswordSettingsState {
  passwordSettings: fromPasswordSettingsReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  companyAdminPasswordSettings: CompanyAdminPasswordSettingsState;
}

// Feature area reducers
export const reducers = {
  passwordSettings: fromPasswordSettingsReducer.reducer,
};

// Select Feature Area
export const selectCompanyAdminPasswordSettingsState =
  createFeatureSelector<CompanyAdminPasswordSettingsState>('companyAdminPasswordSettings');

// View Selectors

export const selectPasswordSettingsState =
  createSelector(selectCompanyAdminPasswordSettingsState, (state: CompanyAdminPasswordSettingsState) => state.passwordSettings);

// Password Settings
export const getPasswordSettings = createSelector(
  selectPasswordSettingsState, fromPasswordSettingsReducer.getPasswordSettings
);

export const getPasswordSettingsLoading = createSelector(
  selectPasswordSettingsState, fromPasswordSettingsReducer.getLoading
);

export const getPasswordSettingsLoadingError = createSelector(
  selectPasswordSettingsState, fromPasswordSettingsReducer.getLoadingError
);

export const getPasswordSettingsModalOpen = createSelector(
  selectPasswordSettingsState, fromPasswordSettingsReducer.getSaveModalOpen
);

export const getPasswordSettingsSaveRequest = createSelector(
  selectPasswordSettingsState, fromPasswordSettingsReducer.getSaveRequest
);

export const getPasswordSettingsSaving = createSelector(
  selectPasswordSettingsState, fromPasswordSettingsReducer.getSaving
);

export const getPasswordSettingsSavingError = createSelector(
  selectPasswordSettingsState, fromPasswordSettingsReducer.getSavingError
);
