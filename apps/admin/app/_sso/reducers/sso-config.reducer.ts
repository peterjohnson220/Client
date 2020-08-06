import { SsoConfigModel } from 'libs/models/sso/sso-config.model';
import { SelectedCustomerConnection } from 'libs/models/sso';

import * as fromSsoConfigActions from '../actions/sso-config.actions';

export interface State {
  configuring: boolean;
  configuringSuccess: boolean;
  configuringError: boolean;
  ssoConfigModalOpen: boolean;
  GettingSsoConfigurations: boolean;
  GettingSsoConfigurationsSuccess: boolean;
  GettingSsoConfigurationsError: boolean;
  SsoConfigList: SsoConfigModel[];
  customerConnectionSelected: boolean;
  selectedCustomerConnection: SelectedCustomerConnection;
  updating: boolean;
  updatingSuccess: boolean;
}

const initialState: State = {
  configuring: false,
  configuringSuccess: false,
  configuringError: false,
  ssoConfigModalOpen: false,
  GettingSsoConfigurations: false,
  GettingSsoConfigurationsSuccess: false,
  GettingSsoConfigurationsError: false,
  SsoConfigList: null,
  customerConnectionSelected: false,
  selectedCustomerConnection: null,
  updating: false,
  updatingSuccess: false,
};

export function reducer(state = initialState, action: fromSsoConfigActions.Actions): State {
  switch (action.type) {
    case fromSsoConfigActions.SSO_CONFIGURE:
      return{
        ...state,
        configuring: true,
        configuringSuccess: false,
        configuringError: false
      };
    case fromSsoConfigActions.SSO_CONFIGURE_SUCCESS:
      return {
        ...state,
        configuring: false,
        configuringSuccess: true,
        configuringError: false,
        ssoConfigModalOpen: false
      };
    case fromSsoConfigActions.SSO_CONFIGURE_ERROR:
      return {
        ...state,
        configuring: false,
        configuringSuccess: false,
        configuringError: true
      };
    case fromSsoConfigActions.OPEN_SSO_CONFIG_MODAL:
      return {
        ...state,
        ssoConfigModalOpen: true
      };
    case fromSsoConfigActions.CLOSE_SSO_CONFIG_MODAL:
      return {
        ...state,
        ssoConfigModalOpen: false,
      };
    case fromSsoConfigActions.GET_SSO_CONFIGURATIONS:
      return {
        ...state,
        GettingSsoConfigurations: true,
        GettingSsoConfigurationsSuccess: false,
        GettingSsoConfigurationsError: false
      };
    case fromSsoConfigActions.GET_SSO_CONFIGURATIONS_SUCCESS:
      return {
        ...state,
        GettingSsoConfigurations: false,
        GettingSsoConfigurationsSuccess: true,
        GettingSsoConfigurationsError: false,
        SsoConfigList: action.payload
      };
    case fromSsoConfigActions.GET_SSO_CONFIGURATIONS_ERROR:
      return {
        ...state,
        GettingSsoConfigurations: false,
        GettingSsoConfigurationsSuccess: false,
        GettingSsoConfigurationsError: true
      };
    case fromSsoConfigActions.DISPLAY_NEW_SSO_IN_GRID:
      return {
        ...state,
        SsoConfigList: state.SsoConfigList.concat(action.payload)
      };
    case fromSsoConfigActions.CONNECTION_SELECTED:
      return {
        ...state,
        customerConnectionSelected: true,
        selectedCustomerConnection: action.payload
      };
    case fromSsoConfigActions.CONNECTION_UNSELECTED:
      return {
        ...state,
        customerConnectionSelected: false,
      };
    case fromSsoConfigActions.UPDATING_SSO_CONFIGURATION:
      return {
        ...state,
        updating: true,
        updatingSuccess: false,
        configuringError: false,
      };
    case fromSsoConfigActions.UPDATE_SSO_CONFIGURATION_SUCCESS:
      return {
        ...state,
        updating: false,
        updatingSuccess: true,
        configuringError: false,
        ssoConfigModalOpen: false
      };
    case fromSsoConfigActions.UPDATE_SSO_CONFIGURATION_ERROR:
      return {
        ...state,
        updating: false,
        updatingSuccess: false,
        configuringError: true,
      }
    default:
      return state;
  }
}

export const getSsoConfiguring = (state: State) => state.configuring;
export const getSsoConfiguringSuccess = (state: State) => state.configuringSuccess;
export const getSsoConfiguringError = (state: State) => state.configuringError;
export const getSsoConfigModalOpen = (state: State) => state.ssoConfigModalOpen;
export const getSsoConfigList =  (state: State) => state.SsoConfigList;
export const getSsoConfigLoading = (state: State) => state.GettingSsoConfigurations;
export const getSsoConfigLoadingSuccess = (state: State) => state.GettingSsoConfigurationsSuccess;
export const getSsoConfigLoadingError = (state: State) => state.GettingSsoConfigurationsError;
export const getSelectedCustomerConnection = (state: State) => state.selectedCustomerConnection;
export const getCustomerConnectionSelected = (state: State) => state.customerConnectionSelected;
export const getUpdatingConfiguration = (state: State) => state.updating;
export const getUpdatingConfigurationSuccess = (state: State) => state.updatingSuccess;
