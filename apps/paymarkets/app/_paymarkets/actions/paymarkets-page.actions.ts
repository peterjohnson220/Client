import { Action } from '@ngrx/store';

export const LOAD_PAYMARKETS  = '[PayMarkets / PayMarkets Page] Load PayMarkets';

export class LoadPayMarkets implements Action {
  readonly type = LOAD_PAYMARKETS;

  constructor() {}
}

export type Actions
  = LoadPayMarkets;
