import { Action } from '@ngrx/store';

import { CredentialsPackage } from 'libs/models';
import { TransferMethod, Provider, EntityChoice } from '../models';

export const INIT = '[Data Management/Transfer Data Page] Init Transfer Data Page';
export const LOAD_AUTHENTICATION_FORM = '[Data Management/Transfer Data Page] Load Authentication Form';
export const LOAD_AUTHENTICATION_FORM_ERROR = '[Data Management/Transfer Data Page] Load Authentication Form Error';
export const LOAD_AUTHENTICATION_FORM_SUCCESS = '[Data Management/Transfer Data Page] Load Authentication Form Success';
export const LOAD_TRANSFER_METHODS = '[Data Management/Transfer Data Page] Load Transfer Methods';
export const LOAD_TRANSFER_METHODS_ERROR = '[Data Management/Transfer Data Page] Load Transfer Methods Error';
export const LOAD_TRANSFER_METHODS_SUCCESS = '[Data Management/Transfer Data Page] Load Transfer Methods Success';
export const LOAD_PROVIDERS = '[Data Management/Transfer Data Page] Load Providers';
export const LOAD_PROVIDERS_ERROR = '[Data Management/Transfer Data Page] Load Providers Error';
export const LOAD_PROVIDERS_SUCCESS = '[Data Management/Transfer Data Page] Load Providers Success';
export const SET_SELECTED_TRANSFER_METHOD = '[Data Management/Transfer Data Page] Set Selected Transfer Method';
export const SET_SELECTED_PROVIDER = '[Data Management/Transfer Data Page] Set Selected Provider';
export const RESET_TRANSFER_DATA_PAGE_WORKFLOW = '[Data Management/Transfer Data Page] Reset Transfer Data Page Workflow';
export const VALIDATE = '[Data Management/Transfer Data Page] Validate Credentials';
export const VALIDATE_ERROR = '[Data Management/Transfer Data Page] Validate Credentials Error';
export const VALIDATE_SUCCESS = '[Data Management/Transfer Data Page] Validate Credentials Success';
export const CREATE_CONNECTION = '[Data Management/Transfer Data Page] Create Connection';
export const CREATE_CONNECTION_ERROR = '[Data Management/Transfer Data Page] Create Connection Error';
export const CREATE_CONNECTION_SUCCESS = '[Data Management/Transfer Data Page] Create Connection Success';
export const LOAD_ENTITY_SELECTION = '[Data Management/Transfer Data Page] Load Entity Selection';
export const LOAD_ENTITY_SELECTION_ERROR = '[Data Management/Transfer Data Page] Load Entity Selection Error';
export const LOAD_ENTITY_SELECTION_SUCCESS = '[Data Management/Transfer Data Page] Load Entity Selection Success';
export const PROCEED_TO_AUTHENTICATION = '[Data Management/Transfer Data Page] Proceed to Authentication';

export class Init implements Action {
  readonly type = INIT;

  constructor() {}
}

export class LoadAuthenticationForm implements Action {
  readonly type = LOAD_AUTHENTICATION_FORM;
}
export class LoadAuthenticationFormError implements Action {
  readonly type = LOAD_AUTHENTICATION_FORM_ERROR;
}
export class LoadAuthenticationFormSuccess implements Action {
  readonly type = LOAD_AUTHENTICATION_FORM_SUCCESS;

  constructor() {}
}

export class LoadTransferMethods implements Action {
  readonly type = LOAD_TRANSFER_METHODS;
}

export class LoadTransferMethodsError implements Action {
  readonly type = LOAD_TRANSFER_METHODS_ERROR;
}

export class LoadTransferMethodsSuccess implements Action {
  readonly type = LOAD_TRANSFER_METHODS_SUCCESS;

  constructor(public payload: TransferMethod[]) {}
}

export class LoadProviders implements Action {
  readonly type = LOAD_PROVIDERS;
}

export class LoadProvidersError implements Action {
  readonly type = LOAD_PROVIDERS_ERROR;
}

export class LoadProvidersSuccess implements Action {
  readonly type = LOAD_PROVIDERS_SUCCESS;

  constructor(public payload: Provider[]) {}
}

export class SetSelectedTransferMethod implements Action {
  readonly type = SET_SELECTED_TRANSFER_METHOD;

  constructor(public payload: number) {}
}

export class SetSelectedProvider implements Action {
  readonly type = SET_SELECTED_PROVIDER;

  constructor(public payload: Provider) {}
}

export class ResetTransferDataPageWorkflow implements Action {
  readonly type = RESET_TRANSFER_DATA_PAGE_WORKFLOW;

  constructor() {}
}

export class Validate implements Action {
  readonly type = VALIDATE;

  constructor(public payload: CredentialsPackage) {}
}
export class ValidateError implements Action {
  readonly type = VALIDATE_ERROR;

  constructor(public payload: string[] = []) {}
}
export class ValidateSuccess implements Action {
  readonly type = VALIDATE_SUCCESS;

  constructor() {}
}

export class CreateConnection implements Action {
  readonly type = CREATE_CONNECTION;

  constructor(public payload: CredentialsPackage) {}
}

export class CreateConnectionError implements Action {
  readonly type = CREATE_CONNECTION_ERROR;

  constructor() {}
}

export class CreateConnectionSuccess implements Action {
  readonly type = CREATE_CONNECTION_SUCCESS;

  constructor() {}
}

export class LoadEntitySelection implements Action {
  readonly type = LOAD_ENTITY_SELECTION;

  constructor() {}
}

export class LoadEntitySelectionError implements Action {
  readonly type = LOAD_ENTITY_SELECTION_ERROR;

  constructor() {}
}

export class LoadEntitySelectionSuccess implements Action {
  readonly type = LOAD_ENTITY_SELECTION_SUCCESS;

  constructor(public payload: EntityChoice[]) {}
}

export class ProceedToAuthentication implements Action {
  readonly type = PROCEED_TO_AUTHENTICATION;

  constructor(public payload: EntityChoice[]) {}
}


export type Actions
  = Init
  | CreateConnection
  | CreateConnectionError
  | CreateConnectionSuccess
  | LoadAuthenticationForm
  | LoadAuthenticationFormError
  | LoadAuthenticationFormSuccess
  | LoadTransferMethods
  | LoadTransferMethodsError
  | LoadTransferMethodsSuccess
  | LoadProviders
  | LoadProvidersError
  | LoadProvidersSuccess
  | SetSelectedTransferMethod
  | SetSelectedProvider
  | ResetTransferDataPageWorkflow
  | Validate
  | ValidateError
  | ValidateSuccess
  | LoadEntitySelection
  | LoadEntitySelectionError
  | LoadEntitySelectionSuccess
  | ProceedToAuthentication;
