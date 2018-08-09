import { ActionReducerMap, createSelector, createFeatureSelector, ActionReducer, MetaReducer } from '@ngrx/store';

import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '../../environments/environment';

import * as fromUserContextReducer from './app-context/reducers/user-context.reducer';
import * as fromCompanySettingsReducer from './app-context/reducers/company-settings.reducer';
import * as fromUiPersistenceSettingsReducer from './app-context/reducers/ui-persistence-settings.reducer';

export interface State {
  userContext: fromUserContextReducer.State;
  companySettings: fromCompanySettingsReducer.State;
  uiPersistenceSettings: fromUiPersistenceSettingsReducer.State;
}

export const reducers: ActionReducerMap<State> = {
  userContext: fromUserContextReducer.reducer,
  companySettings: fromCompanySettingsReducer.reducer,
  uiPersistenceSettings: fromUiPersistenceSettingsReducer.reducer
};

// If you wish to have all actions and states logged to the console, add this to your metaReducers for development
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [storeFreeze]
  : [];

/**
 * User Context Reducers
 */
export const getUserContextState = createFeatureSelector<fromUserContextReducer.State>('userContext');

export const getUserContext = createSelector(getUserContextState, fromUserContextReducer.getUserContext);
export const getGettingUserContext = createSelector(getUserContextState, fromUserContextReducer.getGettingUserContext);
export const getGettingUserContextError =
  createSelector(getUserContextState, fromUserContextReducer.getGettingUserContextError);
export const getGettingUserContextAttempted =
  createSelector(getUserContextState, fromUserContextReducer.getGettingUserContextAttempted);

export const getIsAdmin = createSelector(getUserContext, (f) => f.AccessLevel === 'Admin');

/**
 * Company Settings Reducers
 */
export const getCompanySettingsState =
  createFeatureSelector<fromCompanySettingsReducer.State>('companySettings');
export const getCompanySettings =
  createSelector(getCompanySettingsState, fromCompanySettingsReducer.getCompanySettings);
export const getGettingCompanySettings =
  createSelector(getCompanySettingsState, fromCompanySettingsReducer.getGettingCompanySettings);
export const getGettingCompanySettingsError =
  createSelector(getCompanySettingsState, fromCompanySettingsReducer.getGettingCompanySettingsError);
export const getGettingCompanySettingsAttempted =
  createSelector(getCompanySettingsState, fromCompanySettingsReducer.getGettingCompanySettingsAttempted);

/**
 * UI Persistence Settings Reducers
 */
export const getUiPersistenceSettingsState =
  createFeatureSelector<fromUiPersistenceSettingsReducer.State>('uiPersistenceSettings');
export const getUiPersistenceSettings =
  createSelector(getUiPersistenceSettingsState, fromUiPersistenceSettingsReducer.getUiPersistenceSettings);
export const getUiPersistenceSettingsSaving =
  createSelector(getUiPersistenceSettingsState, fromUiPersistenceSettingsReducer.getSaving);
export const getUiPersistenceSettingsSavingSuccess =
  createSelector(getUiPersistenceSettingsState, fromUiPersistenceSettingsReducer.getSavingSuccess);
export const getUiPersistenceLastAttemptedSaveSettingName =
  createSelector(getUiPersistenceSettingsState, fromUiPersistenceSettingsReducer.getLastAttemptedSaveSettingName);
