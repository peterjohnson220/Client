import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ConfigurationGroup } from 'libs/models/data-loads';

import * as fromConfigurationGroupsActions from '../actions/configuration-groups.actions';

export interface State extends EntityState<ConfigurationGroup> {
  loadingConfigurationGroups: boolean;
  loadingConfigurationGroupsError: boolean;
}

export const adapter: EntityAdapter<ConfigurationGroup> = createEntityAdapter<ConfigurationGroup>({
  selectId: (x: ConfigurationGroup) => x.LoaderConfigurationGroupId
});

const initialState: State = adapter.getInitialState({
  loadingConfigurationGroups: false,
  loadingConfigurationGroupsError: false
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
        ...adapter.setAll(action.payload, state),
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
    default: {
      return state;
    }
  }
}

export const getLoadingConfigurationGroups = (state: State) => state.loadingConfigurationGroups;
export const getLoadingConfigurationGroupsError = (state: State) => state.loadingConfigurationGroupsError;
