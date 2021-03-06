import { ActionReducerMap, createSelector, createFeatureSelector, ActionReducer, MetaReducer } from '@ngrx/store';

import { environment } from '../../environments/environment';

import * as fromUserContextReducer from './app-context/reducers/user-context.reducer';
import * as fromLegacyCompanySettingsReducer from './app-context/reducers/legacy-company-settings.reducer';
import * as fromUiPersistenceSettingsReducer from './app-context/reducers/ui-persistence-settings.reducer';
import * as fromUserAssignedRoleReducer from './app-context/reducers/user-assigned-roles.reducer';
import * as fromCompanyContextReducer from './app-context/reducers/company-context.reducer';
import * as fromCompanySettingsReducer from './app-context/reducers/company-settings.reducer';
import * as fromFeatureFlagReducer from './app-context/reducers/feature-flag-redirect.reducer';

export interface State {
  userContext: fromUserContextReducer.State;
  legacyCompanySettings: fromLegacyCompanySettingsReducer.State;
  uiPersistenceSettings: fromUiPersistenceSettingsReducer.State;
  userAssignedRoles: fromUserAssignedRoleReducer.State;
  companyContext: fromCompanyContextReducer.State;
  companySettings: fromCompanySettingsReducer.State;
  featureFlagRedirectUrls: fromFeatureFlagReducer.State;
}

export const reducers: ActionReducerMap<State> = {
  userContext: fromUserContextReducer.reducer,
  legacyCompanySettings: fromLegacyCompanySettingsReducer.reducer,
  uiPersistenceSettings: fromUiPersistenceSettingsReducer.reducer,
  userAssignedRoles: fromUserAssignedRoleReducer.reducer,
  companyContext: fromCompanyContextReducer.reducer,
  companySettings: fromCompanySettingsReducer.reducer,
  featureFlagRedirectUrls: fromFeatureFlagReducer.reducer
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
  ? []
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
export const hasUserContext = createSelector(getUserContextState, fromUserContextReducer.hasUserContext);
export const getErrorMessage = createSelector(getUserContextState, fromUserContextReducer.getErrorMessage);
export const getForbidden = createSelector(getUserContextState, fromUserContextReducer.getForbidden);

/**
 * Legacy Company Settings Reducers
 */
export const getLegacyCompanySettingsState =
  createFeatureSelector<fromLegacyCompanySettingsReducer.State>('legacyCompanySettings');
export const getLegacyCompanySettings =
  createSelector(getLegacyCompanySettingsState, fromLegacyCompanySettingsReducer.getCompanySettings);
export const getGettingLegacyCompanySettings =
  createSelector(getLegacyCompanySettingsState, fromLegacyCompanySettingsReducer.getGettingCompanySettings);
export const getGettingLegacyCompanySettingsError =
  createSelector(getLegacyCompanySettingsState, fromLegacyCompanySettingsReducer.getGettingCompanySettingsError);
export const getGettingLegacyCompanySettingsAttempted =
  createSelector(getLegacyCompanySettingsState, fromLegacyCompanySettingsReducer.getGettingCompanySettingsAttempted);

/**
 * Company Settings Reducer Selectors
 */

export const getCompanySettingsState = createFeatureSelector<fromCompanySettingsReducer.State>('companySettings');
export const getCompanySettings = createSelector(getCompanySettingsState, fromCompanySettingsReducer.getCompanySettings);
export const getCompanySettingsLoading = createSelector(getCompanySettingsState, fromCompanySettingsReducer.getCompanySettingsLoading);
export const getCompanySettingsLoadAttempted = createSelector(
  getCompanySettingsState,
  fromCompanySettingsReducer.getCompanySettingsLoadAttempted
);
export const getCompanySettingsError = createSelector(
  getCompanySettingsState,
  fromCompanySettingsReducer.getCompanySettingsLoadingError
);
export const getPuttingCompanySettings =
  createSelector(getCompanySettingsState, fromCompanySettingsReducer.getPuttingCompanySettings);
export const getPuttingCompanySettingsError =
  createSelector(getCompanySettingsState, fromCompanySettingsReducer.getPuttingCompanySettingsError);


/**
 * UI Persistence Settings Reducers
 */
export const getUiPersistenceSettingsState =
  createFeatureSelector<fromUiPersistenceSettingsReducer.State>('uiPersistenceSettings');
export const getUiPersistenceSettingsLoading = createSelector(getUiPersistenceSettingsState, fromUiPersistenceSettingsReducer.getLoading);
export const getUiPersistenceSettings =
  createSelector(getUiPersistenceSettingsState, fromUiPersistenceSettingsReducer.getUiPersistenceSettings);
export const getUiPersistenceSettingsSaving =
  createSelector(getUiPersistenceSettingsState, fromUiPersistenceSettingsReducer.getSaving);
export const getUiPersistenceSettingsSavingSuccess =
  createSelector(getUiPersistenceSettingsState, fromUiPersistenceSettingsReducer.getSavingSuccess);
export const getUiPersistenceLastAttemptedSaveSettingName =
  createSelector(getUiPersistenceSettingsState, fromUiPersistenceSettingsReducer.getLastAttemptedSaveSettingName);
export const getUiPersistenceSettingsSavingError =
  createSelector(getUiPersistenceSettingsState, fromUiPersistenceSettingsReducer.getSavingError);

/**
 * User Assigned Role Reducers
 */
export const getUserAssignedRoleState =
  createFeatureSelector<fromUserAssignedRoleReducer.State>('userAssignedRoles');
export const getUserAssignedRoles =
  createSelector(getUserAssignedRoleState, fromUserAssignedRoleReducer.getUserAssignedRoles);
export const getUserAssignedRolesLoading =
  createSelector(getUserAssignedRoleState, fromUserAssignedRoleReducer.getLoading);
export const getUserAssignedRolesLoadingError =
  createSelector(getUserAssignedRoleState, fromUserAssignedRoleReducer.getLoadingError);
export const getUserAssignedRolesAttempted =
  createSelector(getUserAssignedRoleState, fromUserAssignedRoleReducer.getUserAssignedRolesAttempted);

/**
 * Company Context Reducers
 */
export const getCompanyContextState = createFeatureSelector<fromCompanyContextReducer.State>('companyContext');

export const getCompanyContext = createSelector(getCompanyContextState, fromCompanyContextReducer.getCompanyContext);
export const getGettingCompanyContext = createSelector(getCompanyContextState, fromCompanyContextReducer.getGettingCompanyContext);
export const getGettingCompanyContextError =
  createSelector(getCompanyContextState, fromCompanyContextReducer.getGettingCompanyContextError);

/**
 * Feature Flag Url Redirect Reducer
 */
export const getFeatureFlagRedirectState = createFeatureSelector<fromFeatureFlagReducer.State>('featureFlagRedirectUrls');

export const getFeatureFlagUrls = createSelector(getFeatureFlagRedirectState, fromFeatureFlagReducer.getFeatureFlagUrls);
export const getLoading = createSelector(getFeatureFlagRedirectState, fromFeatureFlagReducer.getLoading);
export const getLoadingError = createSelector(getFeatureFlagRedirectState, fromFeatureFlagReducer.getLoadingError);
export const getPageRedirectUrl = createSelector(getFeatureFlagRedirectState, (state, props) => {
  const redirectObj = state.redirectUrls.obj.find(x => x.TargetPage === props.page);
  if (redirectObj === undefined) {
    return undefined;
  }

  return redirectObj.RedirectUrl;
});

