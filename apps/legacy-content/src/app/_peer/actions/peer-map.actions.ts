import { Action } from '@ngrx/store';

import { ExchangeMapFilter, ExchangeMapResponse, InitialMapFilterRequest } from 'libs/models/peer';

export const LOADING_PEER_MAP  = '[Peer Add Data Cut/Map] Loading Peer Map';
export const LOADING_PEER_MAP_SUCCESS  = '[Peer Add Data Cut/Map] Loading Peer Map Success';
export const LOADING_PEER_MAP_ERROR  = '[Peer Add Data Cut/Map] Loading Peer Map Error';
export const LOADING_INITIAL_PEER_MAP_FILTER = '[Peer Add Data Cut/Map] Load Initial Peer Map Filter';
export const LOADING_INITIAL_PEER_MAP_FILTER_SUCCESS = '[Peer Add Data Cut/Map] Load Initial Peer Map Filter Success';
export const UPDATE_PEER_MAP_FILTER_BOUNDS = '[Peer Add Data Cut/Map] Update Peer Map Filter Bounds';
export const SKIP_MAP_QUERY = '[Peer Add Data Cut/Map] Skip Map Query';

export class LoadingPeerMap implements Action {
  readonly type = LOADING_PEER_MAP;
  readonly payload = null;
}

export class LoadingPeerMapSuccess implements Action {
  readonly type = LOADING_PEER_MAP_SUCCESS;

  constructor(public payload: ExchangeMapResponse) {}
}

export class LoadingPeerMapError implements Action {
  readonly type = LOADING_PEER_MAP_ERROR;
  readonly payload = null;
}

export class LoadingInitialPeerMapFilter implements Action {
  readonly type = LOADING_INITIAL_PEER_MAP_FILTER;

  constructor(public payload: InitialMapFilterRequest) { }
}

export class LoadingInitialPeerMapFilterSuccess implements Action {
  readonly type = LOADING_INITIAL_PEER_MAP_FILTER_SUCCESS;

  constructor(public payload: ExchangeMapFilter) { }
}

export class UpdatePeerMapFilterBounds implements Action {
  readonly type = UPDATE_PEER_MAP_FILTER_BOUNDS;

  constructor(public payload: any) { }
}

export class SkipMapQuery implements Action {
  readonly type = SKIP_MAP_QUERY;
  readonly payload = null;
}

export type Actions
  = LoadingPeerMap
  | LoadingPeerMapSuccess
  | LoadingPeerMapError
  | LoadingInitialPeerMapFilter
  | LoadingInitialPeerMapFilterSuccess
  | UpdatePeerMapFilterBounds
  | SkipMapQuery;
