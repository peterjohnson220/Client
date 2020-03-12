import { Action } from '@ngrx/store';

import { ConnectionSummary } from '../models';
import { CredentialsPackage } from 'libs/models';

export const INIT = '[Data Management/Outbound JDM] Initialize';
export const INIT_FIELD_MAPPINGS = '[Data Management/Outbound JDM] Init Field Mappings';
export const LOAD_CONNECTION_SUMMARY = '[Data Management/Outbound JDM] Load Connection Summary';
export const LOAD_CONNECTION_SUMMARY_ERROR = '[Data Management/Outbound JDM] Load Connection Summary Error';
export const LOAD_CONNECTION_SUMMARY_SUCCESS = '[Data Management/Outbound JDM] Load Connection Summary Success';
export const RESET_CONNECTION_SUMMARY = '[Data Management/Outbound JDM] Reset Connection Summary';
export const RESET_FIELD_MAPPINGS = '[Data Management/Outbound JDM] Reset Field Mappings';
export const SAVE_CONNECTION_SUMMARY = '[Data Management/Outbound JDM] Save Connection Summary';
export const SAVE_CONNECTION_SUMMARY_ERROR = '[Data Management/Outbound JDM] Save Connection Summary Error';
export const SAVE_CONNECTION_SUMMARY_SUCCESS = '[Data Management/Outbound JDM] Save Connection Summary Success';
export const SAVE_CREDENTIALS = '[Data Management/Outbound JDM] Save Credentials';
export const COMPLETE_CONNECTION = '[Data Management/Outbound JDM] Complete Connection';

export class Init implements Action {
  readonly type = INIT;

  constructor() {}
}

export class InitFieldMappings implements Action {
  readonly type = INIT_FIELD_MAPPINGS;

  constructor() {}
}

export class LoadConnectionSummary implements Action {
  readonly type = LOAD_CONNECTION_SUMMARY;

  constructor() {}
}

export class LoadConnectionSummaryError implements Action {
  readonly type = LOAD_CONNECTION_SUMMARY_ERROR;

  constructor() {}
}

export class LoadConnectionSummarySuccess implements Action {
  readonly type = LOAD_CONNECTION_SUMMARY_SUCCESS;

  constructor(public payload: ConnectionSummary) {}
}

export class ResetConnectionSummary implements Action {
  readonly type = RESET_CONNECTION_SUMMARY;

  constructor() {}
}

export class ResetFieldMappings implements Action {
  readonly type = RESET_FIELD_MAPPINGS;

  constructor() {}
}

export class SaveConnectionSummary implements Action {
  readonly type = SAVE_CONNECTION_SUMMARY;

  constructor(public payload: ConnectionSummary) {}
}

export class SaveConnectionSummaryError implements Action {
  readonly type = SAVE_CONNECTION_SUMMARY_ERROR;
}

export class SaveConnectionSummarySuccess implements Action {
  readonly type = SAVE_CONNECTION_SUMMARY_SUCCESS;

  constructor(public payload: ConnectionSummary) {}
}

export class SaveCredentials implements Action {
  readonly type = SAVE_CREDENTIALS;

  constructor(public payload: CredentialsPackage) {}
}

export class CompleteConnection implements Action {
  readonly type = COMPLETE_CONNECTION;
}

export type Actions
  = Init
  | LoadConnectionSummary
  | LoadConnectionSummaryError
  | LoadConnectionSummarySuccess
  | ResetConnectionSummary
  | ResetFieldMappings
  | SaveConnectionSummary
  | SaveConnectionSummaryError
  | SaveConnectionSummarySuccess
  | SaveCredentials
  | CompleteConnection;
