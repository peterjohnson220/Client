import { Action } from '@ngrx/store';

import { CustomerConnection } from 'libs/models/sso';


export const SSO_CONFIGURE = '[Pf-Admin/SSO Config] SSO Configure';
export const SSO_CONFIGURE_SUCCESS = '[Pf-Admin/SSO Config] SSO Configure Success';
export const SSO_CONFIGURE_ERROR = '[Pf-Admin/SSO Config] SSO Configure Error';


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

export type Actions
  = SsoConfigure
  | SsoConfigureSuccess
  | SsoConfigureError;
