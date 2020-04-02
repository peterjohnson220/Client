import { Action } from '@ngrx/store';

import { CredentialsPackage } from 'libs/models';
import { TransferMethod, Provider, EntityChoice, JdmView } from '../models';
import { TransferDataWorkflowStep } from '../data';

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
export const PROCEED_TO_AUTHENTICATION = '[Data Management/Transfer Data Page] Proceed to Authentication';
export const UPDATE_WORKFLOWSTEP = '[Data Management/Transfer Data Page] Update Workfow Step';

// Outbound workflow
// TODO: clean this up post sales demo
export const LOAD_OUTBOUND_PROVIDERS = '[Data Management/Transfer Data Page/Outbound] Load Outbound Providers';
export const LOAD_OUTBOUND_PROVIDERS_ERROR = '[Data Management/Transfer Data Page/Outbound] Load Outbound Providers Error';
export const LOAD_OUTBOUND_PROVIDERS_SUCCESS = '[Data Management/Transfer Data Page/Outbound] Load Outbound Providers Success';
export const SET_OUTBOUND_SELECTED_PROVIDER = '[Data Management/Transfer Data Page/Outbound] Set Outbound Selected Provider';
export const SET_OUTBOUND_SELECTED_TRANSFER_METHOD = '[Data Management/Transfer Data Page/Outbound] Set Outbound Selected Transfer Method';
export const LOAD_OUTBOUND_TRANSFER_METHODS = '[Data Management/Transfer Data Page/Outbound] Load Outbound Transfer Methods';
export const LOAD_OUTBOUND_TRANSFER_METHODS_ERROR = '[Data Management/Transfer Data Page/Outbound] Load Outbound Transfer Methods Error';
export const LOAD_OUTBOUND_TRANSFER_METHODS_SUCCESS = '[Data Management/Transfer Data Page/Outbound] Load Outbound Transfer Methods Success';
export const OUTBOUND_INIT = '[Data Management/Transfer Data Page/Outbound] Init Outbound Transfer Data Page';
export const UPDATE_OUTBOUND_WORKFLOWSTEP = '[Data Management/Transfer Data Page/Outbound] Update Outbound Workfow Step';
export const RESET_OUTBOUND_TRANSFER_DATA_PAGE_WORKFLOW = '[Data Management/Transfer Data Page/Outbound] Reset Outbound Transfer Data Page Workflow';

// Mock outbound JDM actions
// TODO: delete these
export const INIT_OUTBOUND_JDM_VIEW_SELECTION_PAGE = '[Data Management/Outbound/JDM View Selection Page] Init Outbound Jdm View Selection Page';
export const LOAD_OUTBOUND_JDM_VIEWS = '[Data Management/Outbound/JDM View Selection Page] Load Outbound Jdm Views';
export const LOAD_OUTBOUND_JDM_VIEWS_ERROR = '[Data Management/Outbound/JDM View Selection Page] Load Outbound Jdm Views Error';
export const LOAD_OUTBOUND_JDM_VIEWS_SUCCESS = '[Data Management/Outbound/JDM View Selection Page] Load Jdm Outbound Views Success';
export const UPDATE_OUTBOUND_JDM_VIEWS = '[Data Management/Outbound/JDM View Selection Page] Update Jdm Views';
export const UPDATE_OUTBOUND_JDM_VIEWS_ERROR = '[Data Management/Outbound/JDM View Selection Page] Update Jdm Views Error';
export const UPDATE_OUTBOUND_JDM_VIEWS_SUCCESS = '[Data Management/Outbound/JDM View Selection Page] Update Jdm Views Success';


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

export class ProceedToAuthentication implements Action {
  readonly type = PROCEED_TO_AUTHENTICATION;

  constructor(public payload: EntityChoice[]) {}
}

export class UpdateWorkflowstep implements Action {
  readonly type = UPDATE_WORKFLOWSTEP;

  constructor(public payload: TransferDataWorkflowStep) {}
}

export class LoadOutboundProviders implements Action {
  readonly type = LOAD_OUTBOUND_PROVIDERS;
}

export class LoadOutboundProvidersError implements Action {
  readonly type = LOAD_OUTBOUND_PROVIDERS_ERROR;
}

export class LoadOutboundProvidersSuccess implements Action {
  readonly type = LOAD_OUTBOUND_PROVIDERS_SUCCESS;

  constructor(public payload: Provider[]) {}
}

export class SetOutboundSelectedProvider implements Action {
  readonly type = SET_OUTBOUND_SELECTED_PROVIDER;

  constructor(public payload: Provider) {}
}

export class SetOutboundSelectedTransferMethod implements Action {
  readonly type = SET_OUTBOUND_SELECTED_TRANSFER_METHOD;

  constructor(public payload: number) {}
}

export class LoadOutboundTransferMethods implements Action {
  readonly type = LOAD_OUTBOUND_TRANSFER_METHODS;
}

export class LoadOutboundTransferMethodsError implements Action {
  readonly type = LOAD_OUTBOUND_TRANSFER_METHODS_ERROR;
}

export class LoadOutboundTransferMethodsSuccess implements Action {
  readonly type = LOAD_OUTBOUND_TRANSFER_METHODS_SUCCESS;

  constructor(public payload: TransferMethod[]) {}
}

export class OutboundInit implements Action {
  readonly type = OUTBOUND_INIT;

  constructor() {}
}

export class UpdateOutboundWorkflowstep implements Action {
  readonly type = UPDATE_OUTBOUND_WORKFLOWSTEP;

  constructor(public payload: TransferDataWorkflowStep) {}
}

export class ResetOutboundTransferDataPageWorkflow implements Action {
  readonly type = RESET_OUTBOUND_TRANSFER_DATA_PAGE_WORKFLOW;

  constructor() {}
}

// mock outbound JDM actions
// TODO: delete these
export class InitOutboundJdmViewSelectionPage implements Action {
  readonly type = INIT_OUTBOUND_JDM_VIEW_SELECTION_PAGE;
}
export class LoadOutboundJdmViews implements Action {
  readonly type = LOAD_OUTBOUND_JDM_VIEWS;
}
export class LoadOutboundJdmViewsError implements Action {
  readonly type = LOAD_OUTBOUND_JDM_VIEWS_ERROR;
}
export class LoadOutboundJdmViewsSuccess implements Action {
  readonly type = LOAD_OUTBOUND_JDM_VIEWS_SUCCESS;

  constructor(public payload: JdmView[]) {}
}
export class UpdateOutboundJdmViews implements Action {
  readonly type = UPDATE_OUTBOUND_JDM_VIEWS;
  constructor(public payload: JdmView[]) {}
}
export class UpdateOutboundJdmViewsError implements Action {
  readonly type = UPDATE_OUTBOUND_JDM_VIEWS_ERROR;
}
export class UpdateOutboundJdmViewsSuccess implements Action {
  readonly type = UPDATE_OUTBOUND_JDM_VIEWS_SUCCESS;
}

export type Actions
  = Init
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
  | ProceedToAuthentication
  | UpdateWorkflowstep
  | LoadOutboundProviders
  | LoadOutboundProvidersError
  | LoadOutboundProvidersSuccess
  | SetOutboundSelectedProvider
  | SetOutboundSelectedTransferMethod
  | LoadOutboundTransferMethods
  | LoadOutboundTransferMethodsError
  | LoadOutboundTransferMethodsSuccess
  | UpdateOutboundWorkflowstep
  | ResetOutboundTransferDataPageWorkflow
  | InitOutboundJdmViewSelectionPage
  | LoadOutboundJdmViews
  | LoadOutboundJdmViewsError
  | LoadOutboundJdmViewsSuccess
  | UpdateOutboundJdmViews
  | UpdateOutboundJdmViewsError
  | UpdateOutboundJdmViewsSuccess;
