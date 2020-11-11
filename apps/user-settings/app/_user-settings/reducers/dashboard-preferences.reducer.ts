import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromDashboardPreferencesPageActions from '../actions/dashboard-preferences.actions';
import { SaveDashboardPreferencesApiResponse, UserTile } from '../models';

// Define our feature state
export interface State {
  saveDashboardPreferencesResponse: string;
  userTilesAsync: AsyncStateObj<UserTile[]>;
  userTilesAsyncUnchanged: AsyncStateObj<UserTile[]>;
}

// Define our initial state
const initialState: State = {
  saveDashboardPreferencesResponse: '',
  userTilesAsync: generateDefaultAsyncStateObj<UserTile[]>([]),
  userTilesAsyncUnchanged: generateDefaultAsyncStateObj<UserTile[]>([])
};

// Reducer function
export function reducer(state = initialState, action: fromDashboardPreferencesPageActions.Actions): State {
  switch (action.type) {
    case fromDashboardPreferencesPageActions.GET_USER_TILES: {
      const userTilesAsyncClone = cloneDeep(state.userTilesAsync);
      userTilesAsyncClone.loading = true;

      return {
        ...state,
        userTilesAsync: userTilesAsyncClone
      };
    }
    case fromDashboardPreferencesPageActions.GET_USER_TILES_SUCCESS: {
      const userTilesAsyncClone = cloneDeep(state.userTilesAsync);
      userTilesAsyncClone.obj = action.payload;
      userTilesAsyncClone.loading = false;

      return {
        ...state,
        userTilesAsync: userTilesAsyncClone,
        userTilesAsyncUnchanged: userTilesAsyncClone
      };
    }
    case fromDashboardPreferencesPageActions.GET_USER_TILES_ERROR: {
      const userTilesAsyncClone = cloneDeep(state.userTilesAsync);
      userTilesAsyncClone.loading = false;
      userTilesAsyncClone.loadingError = true;

      return {
        ...state
      };
    }
    case fromDashboardPreferencesPageActions.TOGGLE_USER_TILE: {
      const selectedUserTile = action.payload;
      const userTilesAsyncClone = cloneDeep(state.userTilesAsync);
      const userTile = userTilesAsyncClone.obj.find((t: UserTile) => t.UserTileId === selectedUserTile.UserTileId);
      if (userTile) {
        userTile.HideOnDashboard = !userTile.HideOnDashboard;
        userTile.Dirty = !userTile.Dirty;
      }

      return {
        ...state,
        userTilesAsync: userTilesAsyncClone,
        saveDashboardPreferencesResponse: ''
      };
    }
    case fromDashboardPreferencesPageActions.SAVE_DASHBOARD_PREFERENCES: {
      return {
        ...state
      };
    }
    case fromDashboardPreferencesPageActions.SAVE_DASHBOARD_PREFERENCES_SUCCESS: {
      const userTilesAsyncClone = cloneDeep(state.userTilesAsync);
      userTilesAsyncClone.obj.forEach(ut => {
        ut.Dirty = false;
      });
      return {
        ...state,
        userTilesAsync: userTilesAsyncClone,
        userTilesAsyncUnchanged: userTilesAsyncClone,
        saveDashboardPreferencesResponse: SaveDashboardPreferencesApiResponse.Success,
      };
    }
    case fromDashboardPreferencesPageActions.SAVE_DASHBOARD_PREFERENCES_ERROR: {
      return {
        ...state,
        saveDashboardPreferencesResponse: SaveDashboardPreferencesApiResponse.Error
      };
    }
    case fromDashboardPreferencesPageActions.CANCEL_DASHBOARD_PREFERENCES_CHANGES: {
      return {
        ...state,
        userTilesAsync: state.userTilesAsyncUnchanged
      };
    }
    default: {
      return state;
    }
  }
}

export const getUserTilesAsync = (state: State) => state.userTilesAsync;
export const getDashboardPreferencesHasPendingChanges = (state: State) => state.userTilesAsync.obj.some(u => u.Dirty);
export const getSavedDashboardPreferencesResponse = (state: State) => state.saveDashboardPreferencesResponse;
