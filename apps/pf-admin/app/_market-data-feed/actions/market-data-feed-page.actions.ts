import { Action } from '@ngrx/store';

import { MarketDataFeedExport } from '../model';

export const GENERATE_FEED  = '[Pf-Admin / Market Data Feed Page] Generate Feed';
export const GENERATE_FEED_SUCCESS  = '[Pf-Admin / Market Data Feed Page] Generate Feed Success';
export const GENERATE_FEED_ERROR  = '[Pf-Admin / Market Data Feed Page] Generate Feed Error';
export const GET_FEEDS  = '[Pf-Admin / Market Data Feed Page] Get Feeds';
export const GET_FEEDS_SUCCESS  = '[Pf-Admin / Market Data Feed Page] Get Feeds Success';
export const GET_FEEDS_ERROR  = '[Pf-Admin / Market Data Feed Page] Get Feeds Error';

export class GenerateFeed implements Action {
  readonly type = GENERATE_FEED;

  constructor() {}
}

export class GenerateFeedSuccess implements Action {
  readonly type = GENERATE_FEED_SUCCESS;

  constructor(public payload: MarketDataFeedExport) {}
}

export class GenerateFeedError implements Action {
  readonly type = GENERATE_FEED_ERROR;

  constructor() {}
}

export class GetFeeds implements Action {
  readonly type = GET_FEEDS;

  constructor() {}
}

export class GetFeedsSuccess implements Action {
  readonly type = GET_FEEDS_SUCCESS;

  constructor(public payload: MarketDataFeedExport[]) {}
}

export class GetFeedsError implements Action {
  readonly type = GET_FEEDS_ERROR;

  constructor() {}
}

export type Actions
  = GenerateFeed
  | GenerateFeedSuccess
  | GenerateFeedError
  | GetFeeds
  | GetFeedsSuccess
  | GetFeedsError;
