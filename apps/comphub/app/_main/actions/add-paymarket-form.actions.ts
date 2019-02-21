import { Action } from '@ngrx/store';

import { AddPayMarketRequest } from 'libs/models/payfactors-api';
import { PricingPaymarket } from '../models';

export const OPEN_FORM = '[Comphub/Add PayMarket Form] Open Add Pay Market Form';
export const CLOSE_FORM = '[Comphub/Add PayMarket Form] Close Add Pay Market Form';
export const SAVE_PAYMARKET = '[Comphub/Add PayMarket Form] Save Pay Market';
export const SAVE_PAYMARKET_SUCCESS = '[Comphub/Add PayMarket Form] Save Pay Market Success';
export const SAVE_PAYMARKET_ERROR = '[Comphub/Add PayMarket Form] Save Pay Market Error';
export const SAVE_PAYMARKET_CONFLICT = '[Comphub/Add PayMarket Form] Save Pay Market Conflict';
export const CLEAR_SAVE_ERROR = '[Comphub/Add PayMarket Form] Clear Save Error';
export const GET_DISMISS_INFO_BANNER_SETTING = '[Comphub/Add PayMarket Form] Get Dismiss Info Banner Setting';
export const OPEN_INFO_BANNER = '[Comphub/Add PayMarket Form] Open Info Banner';
export const CLOSE_INFO_BANNER = '[Comphub/Add PayMarket Form] Close Info Banner';

export class OpenForm implements Action {
  readonly type = OPEN_FORM;

  constructor(public payload?: { showSkipButton: boolean }) {}
}

export class CloseForm implements Action {
  readonly type = CLOSE_FORM;
}

export class SavePaymarket implements Action {
  readonly type = SAVE_PAYMARKET;

  constructor(public payload: AddPayMarketRequest) {}
}

export class SavePaymarketSuccess implements Action {
  readonly type = SAVE_PAYMARKET_SUCCESS;

  constructor(public payload: PricingPaymarket) {}
}

export class SavePaymarketError implements Action {
  readonly type = SAVE_PAYMARKET_ERROR;
}

export class SavePaymarketConflict implements Action {
  readonly type = SAVE_PAYMARKET_CONFLICT;
}

export class ClearSaveError implements Action {
  readonly type = CLEAR_SAVE_ERROR;
}

export class GetDismissInfoBannerSetting implements Action {
  readonly type = GET_DISMISS_INFO_BANNER_SETTING;
}

export class OpenInfoBanner implements Action {
  readonly type = OPEN_INFO_BANNER;
}

export class CloseInfoBanner implements Action {
  readonly type = CLOSE_INFO_BANNER;
}

export type Actions
  = OpenForm
  | CloseForm
  | SavePaymarket
  | SavePaymarketSuccess
  | SavePaymarketError
  | SavePaymarketConflict
  | ClearSaveError
  | GetDismissInfoBannerSetting
  | OpenInfoBanner
  | CloseInfoBanner;
