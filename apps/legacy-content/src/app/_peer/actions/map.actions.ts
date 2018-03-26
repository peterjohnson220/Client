import { Action } from '@ngrx/store';

import { ExchangeMapResponse } from 'libs/models/peer';

export const LOADING_PEER_MAP  = '[Peer Add Data Cut/Map] Loading Peer Map';
export const LOADING_PEER_MAP_SUCCESS  = '[Peer Add Data Cut/Map] Loading Peer Map Success';
export const LOADING_PEER_MAP_ERROR  = '[Peer Add Data Cut/Map] Loading Peer Map Error';
export const UPDATE_PEER_MAP_FILTER_BOUNDS = '[Peer Add Data Cut/Map] Update Peer Map Filter Bounds';
export const INITIAL_MAP_MOVE_COMPLETE = '[Peer Add Data Cut/Map] Initial Map Move Complete';

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

export class UpdatePeerMapFilterBounds implements Action {
  readonly type = UPDATE_PEER_MAP_FILTER_BOUNDS;

  constructor(public payload: any) { }
}

export class InitialMapMoveComplete implements Action {
  readonly type = INITIAL_MAP_MOVE_COMPLETE;

  constructor(public payload: any) { }
}

export type Actions
  = LoadingPeerMap
  | LoadingPeerMapSuccess
  | LoadingPeerMapError
  | UpdatePeerMapFilterBounds
  | InitialMapMoveComplete;
