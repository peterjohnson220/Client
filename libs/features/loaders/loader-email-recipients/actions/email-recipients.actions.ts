import { Action } from '@ngrx/store';
import { ConfigurationGroup, EmailRecipientModel } from '../../../../models/data-loads';

export const LOAD_EMAIL_RECIPIENTS = '[Org Data Loader/Email Recipients] Loading Recipients';
export const LOAD_EMAIL_RECIPIENTS_ERROR = '[Org Data Loader/Email Recipients] Loading Recipients Error';
export const LOAD_EMAIL_RECIPIENTS_SUCCESS = '[Org Data Loader/Email Recipients] Loading Recipients Success';

export const SAVING_EMAIL_RECIPIENT = '[Org Data Loader/Email Recipients] Saving Recipient';
export const SAVING_EMAIL_RECIPIENT_ERROR = '[Org Data Loader/Email Recipients] Saving Recipient Error';
export const SAVING_EMAIL_RECIPIENT_SUCCESS = '[Org Data Loader/Email Recipients] Saving Recipient Success';

export const REMOVING_EMAIL_RECIPIENT = '[Org Data Loader/Email Recipients] Removing Recipient';
export const REMOVING_EMAIL_RECIPIENT_ERROR = '[Org Data Loader/Email Recipients] Removing Recipient Error';
export const REMOVING_EMAIL_RECIPIENT_SUCCESS = '[Org Data Loader/Email Recipients] Removing Recipient Success';

export const OPEN_EMAIL_RECIPIENTS_MODAL = '[Org Data Loader/Email Recipients] Open Email Recipients Modal';
export const CLOSE_EMAIL_RECIPIENTS_MODAL = '[Org Data Loader/Email Recipients] Close Email Recipients Modal';

export const SET_CREATED_CONFIGURATION_GROUP = '[Org Data Loader/Email Recipients] Set created configuration group';

export class LoadEmailRecipients implements Action {
  readonly type = LOAD_EMAIL_RECIPIENTS;

  constructor(public payload: any) {}
}

export class LoadEmailRecipientsError implements Action {
  readonly type = LOAD_EMAIL_RECIPIENTS_ERROR;

  constructor(public payload: any = null) {}
}

export class LoadEmailRecipientsSuccess implements Action {
  readonly type = LOAD_EMAIL_RECIPIENTS_SUCCESS;

  constructor(public payload: any) {}
}

export class SavingEmailRecipient implements Action {
  readonly type = SAVING_EMAIL_RECIPIENT;

  constructor(public recipient: EmailRecipientModel, public configurationGroup: ConfigurationGroup) {}
}

export class SavingEmailRecipientError implements Action {
  readonly type = SAVING_EMAIL_RECIPIENT_ERROR;

  constructor(public payload: any = null) {}
}

export class SavingEmailRecipientSuccess implements Action {
  readonly type = SAVING_EMAIL_RECIPIENT_SUCCESS;

  constructor(public payload: any) {}
}

export class RemovingEmailRecipient implements Action {
  readonly type = REMOVING_EMAIL_RECIPIENT;

  constructor(public payload: any) {}
}

export class RemovingEmailRecipientError implements Action {
  readonly type = REMOVING_EMAIL_RECIPIENT_ERROR;

  constructor(public payload: any = null) {}
}

export class RemovingEmailRecipientSuccess implements Action {
  readonly type = REMOVING_EMAIL_RECIPIENT_SUCCESS;

  constructor(public payload: any) {}
}

export class OpenEmailRecipientsModal implements Action {
  readonly type = OPEN_EMAIL_RECIPIENTS_MODAL;
}
export class CloseEmailRecipientsModal implements Action {
  readonly type = CLOSE_EMAIL_RECIPIENTS_MODAL;
}

export class SetCreatedConfigurationGroup implements Action {
  readonly type = SET_CREATED_CONFIGURATION_GROUP;

  constructor(public configurationGroup: ConfigurationGroup) {}
}

export type Actions
  = LoadEmailRecipients
  | LoadEmailRecipientsError
  | LoadEmailRecipientsSuccess
  | SavingEmailRecipient
  | SavingEmailRecipientError
  | SavingEmailRecipientSuccess
  | RemovingEmailRecipient
  | RemovingEmailRecipientError
  | RemovingEmailRecipientSuccess
  | OpenEmailRecipientsModal
  | CloseEmailRecipientsModal
  | SetCreatedConfigurationGroup;
