import { HttpErrorResponse } from '@angular/common/http';

import { Action } from '@ngrx/store';

import { ComphubPages } from '../data';
import { CountryDataSet, JobPricingLimitInfo, ExchangeDataSet, FooterContext, JobData } from '../models';

export const INIT = '[Comphub/Comphub Page] Init Comphub Page';
export const NAVIGATE_TO_CARD = '[Comphub/Comphub Page] Navigate to Card';
export const NAVIGATE_TO_NEXT_CARD = '[Comphub/Comphub Page] Navigate to Next Card';
export const NAVIGATE_TO_PREVIOUS_CARD = '[Comphub/Comphub Page] Navigate to Previous Card';
export const ADD_ACCESSIBLE_PAGES = '[Comphub/Comphub Page] Add Accessible Pages';
export const REMOVE_ACCESSIBLE_PAGES = '[Comphub/Comphub Page] Remove Accessible Pages';
export const RESET_ACCESSIBLE_PAGES = '[Comphub/Comphub Page] Reset Accessible Pages';
export const RESET_PAGES_ACCESSED = '[Comphub/Comphub Page] Reset Pages Accessed';
export const UPDATE_CARD_SUBTITLE = '[Comphub/Comphub Page] Update Card Subtitle';
export const GET_JOB_PRICING_LIMIT_INFO = '[Comphub/Comphub Page] Get Job Pricing Limit Info';
export const SET_JOB_PRICING_LIMIT_INFO = '[Comphub/Comphub Page] Set Job Pricing Limit Info';
export const GET_COUNTRY_DATA_SETS = '[Comphub/Comphub Page] Get Active Country Data Sets';
export const GET_COUNTRY_DATA_SETS_SUCCESS = '[Comphub/Comphub Page] Get Country Data Sets Success';
export const HANDLE_API_ERROR = '[Comphub/Comphub Page] Handle API Error';
export const UPDATE_ACTIVE_COUNTRY_DATA_SET = '[Comphub/Comphub Page] Update Active Country Data Set';
export const GET_EXCHANGE_DATA_SETS = '[Comphub/Comphub Page] Get Exchange Data Sets';
export const GET_EXCHANGE_DATA_SETS_SUCCESS = '[Comphub/Comphub Page] Get Exchange Data Sets Success';
export const UPDATE_ACTIVE_EXCHANGE_DATA_SET = '[Comphub/Comphub Page] Update Active Exchange Data Set';
export const SET_QUICK_PRICE_TYPE_IN_WORKFLOW_CONTEXT = '[Comphub/Comphub Page] Set Quick Price Type In Workflow Context';
export const SET_QUICK_PRICE_HISTORY_MODAL_OPEN = '[Comphub/Comphub Page] Set Quick Price History Modal Open';
export const UPDATE_FOOTER_CONTEXT = '[Comphub/Comphub Page] Update Footer Context';
export const SET_FOOTER_CONTEXT = '[Comphub/Comphub Page] Set Footer Context';
export const SET_SELECTED_JOB_DATA = '[Comphub/Comphub Page] Set Selected Job Data';
export const CLEAR_SELECTED_JOB_DATA = '[Comphub/Comphub Page] Clear Selected Job Data';

export class Init implements Action {
  readonly type = INIT;

  constructor() {}
}

export class NavigateToCard implements Action {
  readonly type = NAVIGATE_TO_CARD;

  constructor(public payload: { cardId: string }) {}
}

export class NavigateToNextCard implements Action {
  readonly type = NAVIGATE_TO_NEXT_CARD;

  constructor() {}
}

export class NavigateToPreviousCard implements Action {
  readonly type = NAVIGATE_TO_PREVIOUS_CARD;

  constructor() {}
}

export class AddAccessiblePages implements Action {
  readonly type = ADD_ACCESSIBLE_PAGES;

  constructor(public payload: ComphubPages[]) {}
}

export class RemoveAccessiblePages implements Action {
  readonly type = REMOVE_ACCESSIBLE_PAGES;

  constructor(public payload: ComphubPages[]) {}
}

export class ResetAccessiblePages implements Action {
  readonly type = RESET_ACCESSIBLE_PAGES;

  constructor() {}
}

export class ResetPagesAccessed implements Action {
  readonly type = RESET_PAGES_ACCESSED;

  constructor() {}
}

export class UpdateCardSubtitle implements Action {
  readonly type = UPDATE_CARD_SUBTITLE;

  constructor(public payload: { cardId: ComphubPages, subTitle: string }) {}
}

export class GetJobPricingLimitInfo implements Action {
  readonly type = GET_JOB_PRICING_LIMIT_INFO;

  constructor() {}
}

export class SetJobPricingLimitInfo implements Action {
  readonly type = SET_JOB_PRICING_LIMIT_INFO;

  constructor(public payload: JobPricingLimitInfo) {}
}

export class GetCountryDataSets implements Action {
  readonly type = GET_COUNTRY_DATA_SETS;
}

export class GetCountryDataSetsSuccess implements Action {
  readonly type = GET_COUNTRY_DATA_SETS_SUCCESS;

  constructor(public payload: CountryDataSet[]) { }
}

export class UpdateActiveCountryDataSet implements Action {
  readonly type = UPDATE_ACTIVE_COUNTRY_DATA_SET;

  constructor(public payload: string) { }
}

export class HandleApiError implements Action {
readonly type = HANDLE_API_ERROR;

  constructor(public payload: HttpErrorResponse) {}
}

export class GetExchangeDataSets implements Action {
  readonly type = GET_EXCHANGE_DATA_SETS;
}

export class GetExchangeDataSetsSuccess implements Action {
  readonly type = GET_EXCHANGE_DATA_SETS_SUCCESS;

  constructor(public payload: ExchangeDataSet[]) { }
}

export class UpdateActiveExchangeDataSet implements Action {
  readonly type = UPDATE_ACTIVE_EXCHANGE_DATA_SET ;

  constructor(public payload: number) { }
}

export class SetQuickPriceTypeInWorkflowContext implements Action {
  readonly type = SET_QUICK_PRICE_TYPE_IN_WORKFLOW_CONTEXT;

  constructor(public payload: string) {}
}

export class SetQuickPriceHistoryModalOpen implements Action {
  readonly type = SET_QUICK_PRICE_HISTORY_MODAL_OPEN;
  constructor(public isOpen: boolean) {}
}

export class UpdateFooterContext implements Action {
  readonly type = UPDATE_FOOTER_CONTEXT;
  constructor() {}
}

export class SetFooterContext implements Action {
  readonly type = SET_FOOTER_CONTEXT;
  constructor(public payload: FooterContext) {}
}

export class SetSelectedJobData implements Action {
  readonly type = SET_SELECTED_JOB_DATA;
  constructor(public payload: JobData) {}
}

export class ClearSelectedJobData implements Action {
  readonly type = CLEAR_SELECTED_JOB_DATA;
  constructor() {}
}

export type Actions
  = Init
  | NavigateToCard
  | NavigateToNextCard
  | NavigateToPreviousCard
  | AddAccessiblePages
  | RemoveAccessiblePages
  | ResetAccessiblePages
  | ResetPagesAccessed
  | UpdateCardSubtitle
  | GetJobPricingLimitInfo
  | SetJobPricingLimitInfo
  | GetCountryDataSets
  | GetCountryDataSetsSuccess
  | UpdateActiveCountryDataSet
  | HandleApiError
  | GetExchangeDataSets
  | GetExchangeDataSetsSuccess
  | UpdateActiveExchangeDataSet
  | SetQuickPriceTypeInWorkflowContext
  | SetQuickPriceHistoryModalOpen
  | UpdateFooterContext
  | SetFooterContext
  | SetSelectedJobData
  | ClearSelectedJobData;
