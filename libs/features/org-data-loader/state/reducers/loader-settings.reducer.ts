import { LoaderSetting } from 'apps/admin/app/_org-data-loader/models/index';

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as fromLoaderSettingsActions from '../actions/loader-settings.actions';

export interface State extends EntityState<LoaderSetting> {
  loading: boolean;
  loadingError: boolean;
  saving: boolean;
  savingSuccess: boolean;
  savingError: boolean;
}

export const adapter: EntityAdapter<LoaderSetting> = createEntityAdapter<LoaderSetting>({
  selectId: (x: LoaderSetting) => x.LoaderSettingsId
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  saving: false,
  savingSuccess: false,
  savingError: false
});

export function reducer(state = initialState, action: fromLoaderSettingsActions.Actions): State {
  switch (action.type) {
    case fromLoaderSettingsActions.LOADING_LOADER_SETTINGS: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromLoaderSettingsActions.LOADING_LOADER_SETTINGS_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
        loading: false
      };
    }
    case fromLoaderSettingsActions.LOADING_LOADER_SETTINGS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromLoaderSettingsActions.SAVING_LOADER_SETTINGS: {
      return {
        ...state,
        saving: true,
        savingSuccess: false,
        savingError: false
      };
    }
    case fromLoaderSettingsActions.SAVING_LOADER_SETTINGS_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingSuccess: true
      };
    }
    case fromLoaderSettingsActions.SAVING_LOADER_SETTINGS_ERROR: {
      return {
        ...state,
        saving: false,
        savingError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoadingLoaderSettings = (state: State) => state.loading;
export const getLoadingLoaderSettingsError = (state: State) => state.loadingError;
export const getSavingLoaderSettings = (state: State) => state.saving;
export const getSavingLoaderSettingsSuccess = (state: State) => state.savingSuccess;
export const getSavingLoaderSettingsError = (state: State) => state.savingError;
