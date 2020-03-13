import { Action } from '@ngrx/store';

import { TransferMethod, Provider, EntityChoice, JdmView } from '../models';

export const INIT = '[Data Management/Provider List/Inbound] Init Inbound Providers';
export const LOAD_PROVIDERS = '[Data Management/Provider List/Inbound] Load Inbound Providers';
export const LOAD_PROVIDERS_ERROR = '[Data Management/Provider List/Inbound] Load Inbound Providers Error';
export const LOAD_PROVIDERS_SUCCESS = '[Data Management/Provider List/Inbound] Load Inbound Providers Success';
export const SET_SELECTED_PROVIDER = '[Data Management/Provider List/Inbound] Set Inbound Selected Provider';

export const LOAD_TRANSFER_METHODS = '[Data Management/Provider List/Inbound] Load Inbound Transfer Methods';
export const LOAD_TRANSFER_METHODS_ERROR = '[Data Management/Provider List/Inbound] Load Inbound Transfer Methods Error';
export const LOAD_TRANSFER_METHODS_SUCCESS = '[Data Management/Provider List/Inbound] Load Inbound Transfer Methods Success';
export const SET_SELECTED_TRANSFER_METHOD = '[Data Management/Provider List/Inbound] Set Inbound Selected Transfer Method';


export class InitProviderList implements Action {
    readonly type = INIT;

    constructor() {}
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

  export class SetSelectedProvider implements Action {
    readonly type = SET_SELECTED_PROVIDER;

    constructor(public payload: Provider) {}
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

  export class SetSelectedTransferMethod implements Action {
    readonly type = SET_SELECTED_TRANSFER_METHOD;

    constructor(public payload: number) {}
  }

  export type Actions
  = InitProviderList
  | LoadProviders
  | LoadProvidersError
  | LoadProvidersSuccess
  | SetSelectedProvider
  | LoadTransferMethods
  | LoadTransferMethodsError
  | LoadTransferMethodsSuccess
  | SetSelectedTransferMethod;
