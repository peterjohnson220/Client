import { Action } from '@ngrx/store';

import { ExchangeMapResponse } from 'libs/models/peer';

export const LOADING_PEER_MAP_DATA  = '[Peer Add Data Cut/Map] Loading Peer Map Data';
export const LOADING_PEER_MAP_DATA_SUCCESS  = '[Peer Add Data Cut/Map] Loading Peer Map Data Success';
export const LOADING_PEER_MAP_DATA_ERROR  = '[Peer Add Data Cut/Map] Loading Peer Map Data Error';
export const UPDATE_PEER_MAP_FILTER_BOUNDS = '[Peer Add Data Cut/Map] Update Peer Map Filter Bounds';
export const INITIAL_MAP_MOVE_COMPLETE = '[Peer Add Data Cut/Map] Initial Map Move Complete';
export const MAP_LOADED = '[Peer Add Data Cut/Map] Map Loaded';

export class LoadingPeerMapData implements Action {
  readonly type = LOADING_PEER_MAP_DATA;
  readonly payload = null;
}

export class LoadingPeerMapDataSuccess implements Action {
  readonly type = LOADING_PEER_MAP_DATA_SUCCESS;

  constructor(public payload: ExchangeMapResponse) {}
}

export class LoadingPeerMapDataError implements Action {
  readonly type = LOADING_PEER_MAP_DATA_ERROR;
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

export class MapLoaded implements Action {
  readonly type = MAP_LOADED;
}

export type Actions
  = LoadingPeerMapData
  | LoadingPeerMapDataSuccess
  | LoadingPeerMapDataError
  | UpdatePeerMapFilterBounds
  | InitialMapMoveComplete
  | MapLoaded;
