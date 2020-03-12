
import * as fromSsoConfigActions from '../actions/sso-config.actions';
import { SsoConfigModel } from 'libs/models/sso/sso-config.model';

export interface State {
  configuring: boolean;
  configuringSuccess: boolean;
  configuringError: boolean;
  addSsoConfigModalOpen: boolean;
  GettingSsoConfigurations: boolean;
  GettingSsoConfigurationsSuccess: boolean;
  GettingSsoConfigurationsError: boolean;
  SsoConfigList: SsoConfigModel[];
}

const initialState: State = {
  configuring: false,
  configuringSuccess: false,
  configuringError: false,
  addSsoConfigModalOpen: false,
  GettingSsoConfigurations: false,
  GettingSsoConfigurationsSuccess: false,
  GettingSsoConfigurationsError: false,
  SsoConfigList: null
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
        addSsoConfigModalOpen: false
      };
    case fromSsoConfigActions.SSO_CONFIGURE_ERROR:
      return {
        ...state,
        configuring: false,
        configuringSuccess: false,
        configuringError: true
      };
    case fromSsoConfigActions.OPEN_ADD_SSO_CONFIG_MODAL:
      return {
        ...state,
        addSsoConfigModalOpen: true
      };
    case fromSsoConfigActions.CLOSE_ADD_SSO_CONFIG_MODAL:
      return {
        ...state,
        addSsoConfigModalOpen: false,
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
    default:
      return state;
  }
}

export const getSsoConfiguring = (state: State) => state.configuring;
export const getSsoConfiguringSuccess = (state: State) => state.configuringSuccess;
export const getSsoConfiguringError = (state: State) => state.configuringError;
export const getAddSsoConfigModalOpen = (state: State) => state.addSsoConfigModalOpen;
export const getSsoConfigList =  (state: State) => state.SsoConfigList;
export const getSsoConfigLoading = (state: State) => state.GettingSsoConfigurations;
export const getSsoConfigLoadingSuccess = (state: State) => state.GettingSsoConfigurationsSuccess;
export const getSsoConfigLoadingError = (state: State) => state.GettingSsoConfigurationsError;
