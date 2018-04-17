import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ClientSettingRequestModel } from '../../models';

import * as fromClientSettingsActions from '../actions/client-settings.actions';

export interface State extends EntityState<ClientSettingRequestModel> {
  loading: boolean;
  loadingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<ClientSettingRequestModel> = createEntityAdapter<ClientSettingRequestModel>({
  selectId: (setting: ClientSettingRequestModel) => setting.SettingName
});

export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});

// Reducer
export function reducer(
  state = initialState,
  action: fromClientSettingsActions.Actions
): State {
  switch (action.type) {
    case fromClientSettingsActions.SAVING_CLIENT_SETTING_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
        loading: false
      };
    }
    case fromClientSettingsActions.SAVING_CLIENT_SETTING_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
