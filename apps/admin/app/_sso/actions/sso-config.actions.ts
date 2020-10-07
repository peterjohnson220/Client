import { Action } from '@ngrx/store';

import { CustomerConnection } from 'libs/models/sso';
import { SsoConfigModel } from 'libs/models/sso/sso-config.model';
import { SelectedCustomerConnection } from 'libs/models/sso/selected-customer-connection.model';


export const SSO_CONFIGURE = '[Pf-Admin/SSO Config] SSO Configure';
export const SSO_CONFIGURE_SUCCESS = '[Pf-Admin/SSO Config] SSO Configure Success';
export const SSO_CONFIGURE_ERROR = '[Pf-Admin/SSO Config] SSO Configure Error';
export const OPEN_SSO_CONFIG_MODAL = '[Pf-Admin/SSO Config] Open Add Sso Configuration Modal';
export const CLOSE_SSO_CONFIG_MODAL = '[Pf-Admin/SSO Config] Close Add Sso Configuration Modal';
export const GET_SSO_CONFIGURATIONS = '[Pf-Admin/SSO Config] Get Sso Configurations';
export const GET_SSO_CONFIGURATIONS_SUCCESS = '[Pf-Admin/SSO Config] Get Sso Configurations Success';
export const GET_SSO_CONFIGURATIONS_ERROR = '[Pf-Admin/SSO Config] Get Sso Configurations Error';
export const DISPLAY_NEW_SSO_IN_GRID = '[Pf-Admin/SSO Config] Display New Sso In Grid';
export const CONNECTION_SELECTED = '[PF-Admin/SSO Config] Customer Connection Selected';
export const CONNECTION_UNSELECTED = '[PF-Admin/SSO Config] Customer Connection Unselected';
export const UPDATING_SSO_CONFIGURATION = '[PF-Admin/SSO Config] Updating Sso Configuration';
export const UPDATE_SSO_CONFIGURATION_SUCCESS = '[PF-Admin/SSO Config] Updating Sso Configuration Success';
export const UPDATE_SSO_CONFIGURATION_ERROR = '[PF-Admin/SSO Config] Updating Sso Configuration Error';

export class SsoConfigure implements Action {
  readonly type = SSO_CONFIGURE;

  constructor(public payload: CustomerConnection) {}
}

export class SsoConfigureSuccess implements Action {
  readonly type = SSO_CONFIGURE_SUCCESS;

  constructor(public payload: any) {}
}

export class SsoConfigureError implements Action {
  readonly type = SSO_CONFIGURE_ERROR;

  constructor(public payload: any) {}
}

export class OpenSsoConfigModal implements Action {
  readonly type = OPEN_SSO_CONFIG_MODAL;
}

export class CloseSsoConfigModal implements Action {
  readonly type = CLOSE_SSO_CONFIG_MODAL;
}

export class GetSsoConfiguration implements Action {
  readonly type = GET_SSO_CONFIGURATIONS;
}

export class GetSsoConfigurationSuccess implements Action {
  readonly type = GET_SSO_CONFIGURATIONS_SUCCESS;
  constructor(public payload: SsoConfigModel[]) {}
}

export class GetSsoConfigurationError implements Action {
  readonly type = GET_SSO_CONFIGURATIONS_ERROR;
}

export class DisplayNewSso implements Action {
  readonly type = DISPLAY_NEW_SSO_IN_GRID;

  constructor(public payload: any) {}
}

export class CustomerConnectionSelected implements Action {
  readonly type = CONNECTION_SELECTED;

  constructor(public payload: SelectedCustomerConnection) {}
}

export class CustomerConnectionUnselected implements Action {
  readonly type = CONNECTION_UNSELECTED;
}

export class UpdatingSsoConfiguration implements Action {
  readonly type = UPDATING_SSO_CONFIGURATION;
  constructor(public payload: SelectedCustomerConnection) {}
}

export class UpdatingSsoConfigurationSuccess implements Action {
  readonly type = UPDATE_SSO_CONFIGURATION_SUCCESS;
  constructor(public payload: any) {}
}

export class UpdatingSsoConfigurationError implements Action {
  readonly type = UPDATE_SSO_CONFIGURATION_ERROR;
  constructor(public payload: any) {}
}

export type Actions
  = SsoConfigure
  | SsoConfigureSuccess
  | SsoConfigureError
  | OpenSsoConfigModal
  | CloseSsoConfigModal
  | GetSsoConfiguration
  | GetSsoConfigurationSuccess
  | GetSsoConfigurationError
  | DisplayNewSso
  | CustomerConnectionSelected
  | CustomerConnectionUnselected
  | UpdatingSsoConfiguration
  | UpdatingSsoConfigurationSuccess
  | UpdatingSsoConfigurationError;
