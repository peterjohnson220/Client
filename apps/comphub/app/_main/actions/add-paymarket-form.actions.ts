import { Action } from '@ngrx/store';

import { AddPayMarketRequest } from 'libs/models/payfactors-api';

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

export class Open implements Action {
  readonly type = OPEN_FORM;
}

export class Close implements Action {
  readonly type = CLOSE_FORM;
}

export class Save implements Action {
  readonly type = SAVE_PAYMARKET;

  constructor(public payload: AddPayMarketRequest) {}
}

export class SaveSuccess implements Action {
  readonly type = SAVE_PAYMARKET_SUCCESS;

  constructor(public payload: { companyPayMarketId: number }) {}
}

export class SaveError implements Action {
  readonly type = SAVE_PAYMARKET_ERROR;
}

export class SaveConflict implements Action {
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
  = Open
  | Close
  | Save
  | SaveSuccess
  | SaveError
  | SaveConflict
  | ClearSaveError
  | GetDismissInfoBannerSetting
  | OpenInfoBanner
  | CloseInfoBanner;
