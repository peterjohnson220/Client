import { Action } from '@ngrx/store';

import { PayMarket } from 'libs/models';
import { AddPayMarketRequest } from 'libs/models/payfactors-api';

export const OPEN_MODAL = '[Comphub/Add PayMarket Modal] Open Add Pay Market Modal';
export const CLOSE_MODAL = '[Comphub/Add PayMarket Modal] Close Add Pay Market Modal';
export const SAVE_PAYMARKET = '[Comphub/Add PayMarket Modal] Save Pay Market';
export const SAVE_PAYMARKET_SUCCESS = '[Comphub/Add PayMarket Modal] Save Pay Market Success';
export const SAVE_PAYMARKET_ERROR = '[Comphub/Add PayMarket Modal] Save Pay Market Error';
export const SAVE_PAYMARKET_CONFLICT = '[Comphub/Add PayMarket Modal] Save Pay Market Conflict';
export const CLEAR_SAVE_ERROR = '[Comphub/Add PayMarket Modal] Clear Save Error';

export class Open implements Action {
  readonly type = OPEN_MODAL;
}

export class Close implements Action {
  readonly type = CLOSE_MODAL;
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

export type Actions
  = Open
  | Close
  | Save
  | SaveSuccess
  | SaveError
  | SaveConflict
  | ClearSaveError;
