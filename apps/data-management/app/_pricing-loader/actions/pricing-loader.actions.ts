import { Action } from '@ngrx/store';

import { EmailRecipientModel, ConfigurationGroup } from 'libs/models/data-loads';
import { UserContext } from 'libs/models';

export const SET_CONFIG_GROUP = '[Pricing Loader] Set Config Group';
export const SET_EMAIL_RECIPIENT = '[Pricing Loader] Set Email Recipient';
export const SAVE_CONFIG = '[Pricing Loader] Save Pricing Loader Config';
export const SAVE_CONFIG_SUCCESS = '[Pricing Loader] Save Pricing Loader Config Success';
export const UPLOAD_FILE = '[Pricing Loader] Upload File';
export const PROCESSING_SUCCESS = '[Pricing Loader] Processing Success';
export const PROCESSING_ERROR = '[Pricing Loader] Processing Error';
export const ADD_EMAIL_RECIPIENT = '[Pricing Loader] Add Email Recipient';
export const ADD_EMAIL_RECIPIENT_SUCCESS = '[Pricing Loader] Add Email Recipient Success';
export const ADD_EMAIL_RECIPIENT_ERROR = '[Pricing Loader] Add Email Recipient Error';
export const RESET_PRICING_LOADER_STATE = '[Pricing Loader] Reset Pricing Loader State';

export class SetConfigGroup implements Action {
  readonly type = SET_CONFIG_GROUP;
  constructor(public payload: ConfigurationGroup) {}
}

export class SetEmailRecipient implements Action {
  readonly type = SET_EMAIL_RECIPIENT;
  constructor(public payload: EmailRecipientModel) {}
}

export class SaveConfig implements Action {
  readonly type = SAVE_CONFIG;
  constructor() {}
}

export class SaveConfigSuccess implements Action {
  readonly type = SAVE_CONFIG_SUCCESS;
  constructor(public payload: { loaderConfigurationGroupId: number }) {}
}

export class ProcessingSuccess implements Action {
  readonly type = PROCESSING_SUCCESS;
  constructor() {}
}

export class ProcessingError implements Action {
  readonly type = PROCESSING_ERROR;
  constructor(public payload: { message: string }) {}
}

export class AddEmailRecipient implements Action {
  readonly type = ADD_EMAIL_RECIPIENT;
  constructor() {}
}

export class AddEmailRecipientSuccess implements Action {
  readonly type = ADD_EMAIL_RECIPIENT_SUCCESS;
  constructor() {}
}

export class AddEmailRecipientError implements Action {
  readonly type = ADD_EMAIL_RECIPIENT_ERROR;
  constructor() {}
}

export class UploadFile implements Action {
  readonly type = UPLOAD_FILE;
  constructor(public payload: { companyId: number, userContext: UserContext, file: File}) {}
}

export class ResetState implements Action {
  readonly type = RESET_PRICING_LOADER_STATE;
  constructor() {}
}

export type Actions
  = SetConfigGroup
  | SetEmailRecipient
  | SaveConfig
  | SaveConfigSuccess
  | ProcessingSuccess
  | ProcessingError
  | AddEmailRecipient
  | AddEmailRecipientSuccess
  | AddEmailRecipientError
  | UploadFile
  | ResetState;
