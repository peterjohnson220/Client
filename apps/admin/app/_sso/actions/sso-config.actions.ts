import { Action } from '@ngrx/store';

import { CustomerConnection } from 'libs/models/sso';
import { SsoConfigModel } from 'libs/models/sso/sso-config.model';


export const SSO_CONFIGURE = '[Pf-Admin/SSO Config] SSO Configure';
export const SSO_CONFIGURE_SUCCESS = '[Pf-Admin/SSO Config] SSO Configure Success';
export const SSO_CONFIGURE_ERROR = '[Pf-Admin/SSO Config] SSO Configure Error';
export const OPEN_ADD_SSO_CONFIG_MODAL = '[Pf-Admin/SSO Config] Open Add Sso Configuration Modal';
export const CLOSE_ADD_SSO_CONFIG_MODAL = '[Pf-Admin/SSO Config] Close Add Sso Configuration Modal';
export const GET_SSO_CONFIGURATIONS = '[Pf-Admin/SSO Config] Get Sso Configurations';
export const GET_SSO_CONFIGURATIONS_SUCCESS = '[Pf-Admin/SSO Config] Get Sso Configurations Success';
export const GET_SSO_CONFIGURATIONS_ERROR = '[Pf-Admin/SSO Config] Get Sso Configurations Error';
export const DISPLAY_NEW_SSO_IN_GRID = '[Pf-Admin/SSO Config] Display New Sso In Grid'

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

export class OpenAddSsoConfigModal implements Action {
  readonly type = OPEN_ADD_SSO_CONFIG_MODAL;
}

export class CloseAddSsoConfigModal implements Action {
  readonly type = CLOSE_ADD_SSO_CONFIG_MODAL;
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

export type Actions
  = SsoConfigure
  | SsoConfigureSuccess
  | SsoConfigureError
  | OpenAddSsoConfigModal
  | CloseAddSsoConfigModal
  | GetSsoConfiguration
  | GetSsoConfigurationSuccess
  | GetSsoConfigurationError
  | DisplayNewSso;
