import { Action } from '@ngrx/store';

import { TransferMethod, Provider } from '../models';

export const INIT = '[Data Management/Transfer Data Page] Init Transfer Data Page';
export const LOAD_TRANSFER_METHODS = '[Data Management/Transfer Data Page] Load Transfer Methods';
export const LOAD_TRANSFER_METHODS_ERROR = '[Data Management/Transfer Data Page] Load Transfer Methods Error';
export const LOAD_TRANSFER_METHODS_SUCCESS = '[Data Management/Transfer Data Page] Load Transfer Methods Success';
export const LOAD_PROVIDERS = '[Data Management/Transfer Data Page] Load Providers';
export const LOAD_PROVIDERS_ERROR = '[Data Management/Transfer Data Page] Load Providers Error';
export const LOAD_PROVIDERS_SUCCESS = '[Data Management/Transfer Data Page] Load Providers Success';
export const SET_SELECTED_TRANSFER_METHOD = '[Data Management/Transfer Data Page] Set Selected Transfer Method';
export const SET_SELECTED_PROVIDER = '[Data Management/Transfer Data Page] Set Selected Provider';
export const RESET_TRANSFER_DATA_PAGE_WORKFLOW = '[Data Management/Transfer Data Page] Reset Transfer Data Page Workflow';

export class Init implements Action {
  readonly type = INIT;

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

  constructor(public payload: number) {}
}

export class ResetTransferDataPageWorkflow implements Action {
  readonly type = RESET_TRANSFER_DATA_PAGE_WORKFLOW;

  constructor() {}
}

export type Actions
  = Init
  | LoadTransferMethods
  | LoadTransferMethodsError
  | LoadTransferMethodsSuccess
  | LoadProviders
  | LoadProvidersError
  | LoadProvidersSuccess
  | SetSelectedTransferMethod
  | SetSelectedProvider
  | ResetTransferDataPageWorkflow;
