import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ConfigurationGroup } from 'libs/models/data-loads';

import * as fromConfigurationGroupsActions from '../actions/configuration-groups.actions';

export interface State extends EntityState<ConfigurationGroup> {
  loadingConfigurationGroups: boolean;
  loadingConfigurationGroupsError: boolean;
  savingConfigurationGroup: boolean;
  savingConfigurationGroupError: boolean;
  savedConfigurationGroup: ConfigurationGroup;
}

export const adapter: EntityAdapter<ConfigurationGroup> = createEntityAdapter<ConfigurationGroup>({
  selectId: (x: ConfigurationGroup) => x.LoaderConfigurationGroupId
});

const initialState: State = adapter.getInitialState({
  loadingConfigurationGroups: false,
  loadingConfigurationGroupsError: false,
  savingConfigurationGroup: false,
  savingConfigurationGroupError: false,
  savedConfigurationGroup: null
});

export function reducer(state = initialState, action: fromConfigurationGroupsActions.Actions): State {
  switch (action.type) {
    case fromConfigurationGroupsActions.LOADING_CONFIGURATION_GROUPS: {
      return {
        ...adapter.removeAll(state),
        loadingConfigurationGroups: true,
        loadingConfigurationGroupsError: false
      };
    }
    case fromConfigurationGroupsActions.LOADING_CONFIGURATION_GROUPS_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
        loadingConfigurationGroups: false,
        loadingConfigurationGroupsError: false
      };
    }
    case fromConfigurationGroupsActions.LOADING_CONFIGURATION_GROUPS_ERROR: {
      return {
        ...state,
        loadingConfigurationGroups: false,
        loadingConfigurationGroupsError: true
      };
    }
    case fromConfigurationGroupsActions.SAVING_CONFIGURATION_GROUP: {
      return {
        ...state,
        savedConfigurationGroup: null,
        savingConfigurationGroup: true,
        savingConfigurationGroupError: false
      };
    }
    case fromConfigurationGroupsActions.SAVING_CONFIGURATION_GROUP_SUCCESS: {
      return {
        ...state,
        savedConfigurationGroup: action.payload,
        savingConfigurationGroup: false,
        savingConfigurationGroupError: false
      };
    }
    case fromConfigurationGroupsActions.SAVING_CONFIGURATION_GROUP_ERROR: {
      return {
        ...state,
        savingConfigurationGroup: false,
        savingConfigurationGroupError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoadingConfigurationGroups = (state: State) => state.loadingConfigurationGroups;
export const getLoadingConfigurationGroupsError = (state: State) => state.loadingConfigurationGroupsError;
export const getSavingConfigurationGroup = (state: State) => state.savingConfigurationGroup;
export const getSavingConfigurationGroupError = (state: State) => state.savingConfigurationGroupError;
export const getSavedConfigurationGroup = (state: State) => state.savedConfigurationGroup;
