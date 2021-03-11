import { Action } from '@ngrx/store';

export const SET_DEFAULT_PAYMARKET  = '[PayMarkets / PayMarkets Page] Set Default PayMarket';
export const SET_DEFAULT_PAYMARKET_SUCCESS  = '[PayMarkets / PayMarkets Page] Set Default PayMarket Success';
export const SET_DEFAULT_PAYMARKET_ERROR  = '[PayMarkets / PayMarkets Page] Set Default PayMarket Error';
export const SAVE_PAGE_VIEW_STYLE = '[PayMarkets / PayMarkets Page] Save Page View Style';

export class SetDefaultPayMarket implements Action {
  readonly type = SET_DEFAULT_PAYMARKET;

  constructor(public payload: number) {}
}

export class SetDefaultPayMarketSuccess implements Action {
  readonly type = SET_DEFAULT_PAYMARKET_SUCCESS;

  constructor() {}
}

export class SetDefaultPayMarketError implements Action {
  readonly type = SET_DEFAULT_PAYMARKET_ERROR;

  constructor() {}
}

export class SavePageViewStyle implements Action {
  readonly type = SAVE_PAGE_VIEW_STYLE;
  constructor(public viewName: string) {}
}

export type Actions
  = SetDefaultPayMarket
  | SetDefaultPayMarketSuccess
  | SetDefaultPayMarketError
  | SavePageViewStyle;
