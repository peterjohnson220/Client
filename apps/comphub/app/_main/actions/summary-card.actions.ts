import { Action } from '@ngrx/store';

export const PRICE_NEW_JOB = '[Comphub/Summary Card] Price New Job';

export class PriceNewJob implements Action {
  readonly type = PRICE_NEW_JOB;

  constructor() {}
}

export type Actions
  = PriceNewJob;
