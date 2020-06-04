import { Action } from '@ngrx/store';

export const GENERATE_FEED  = '[Pf-Admin / Market Data Feed Page] Generate Feed';
export const GENERATE_FEED_SUCCESS  = '[Pf-Admin / Market Data Feed Page] Generate Feed Success';
export const GENERATE_FEED_ERROR  = '[Pf-Admin / Market Data Feed Page] Generate Feed Error';

export class GenerateFeed implements Action {
  readonly type = GENERATE_FEED;

  constructor() {}
}

export class GenerateFeedSuccess implements Action {
  readonly type = GENERATE_FEED_SUCCESS;

  constructor() {}
}

export class GenerateFeedError implements Action {
  readonly type = GENERATE_FEED_ERROR;

  constructor() {}
}

export type Actions
  = GenerateFeed
  | GenerateFeedSuccess
  | GenerateFeedError;
