import { HttpErrorResponse } from '@angular/common/http';

import { Action } from '@ngrx/store';

import { ComphubPages } from '../data';
import { JobPricingLimitInfo } from '../models';

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
export const HANDLE_API_ERROR = '[Comphub/Comphub Page] Handle API Error';

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

export class HandleApiError implements Action {
readonly type = HANDLE_API_ERROR;

  constructor(public payload: HttpErrorResponse) {}
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
  | HandleApiError;
