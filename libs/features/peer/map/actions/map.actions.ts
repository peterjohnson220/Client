import { Action } from '@ngrx/store';

import { ExchangeMapResponse } from 'libs/models/peer';

export const LOAD_PEER_MAP_DATA  = '[Features/Peer/Map] Load Peer Map Data';
export const LOAD_PEER_MAP_DATA_SUCCESS  = '[Features/Peer/Map] Load Peer Map Data Success';
export const LOAD_PEER_MAP_DATA_ERROR  = '[Features/Peer/Map] Load Peer Map Data Error';
export const UPDATE_PEER_MAP_FILTER_BOUNDS = '[Features/Peer/Map] Update Peer Map Filter Bounds';
export const INITIAL_MAP_MOVE_COMPLETE = '[Features/Peer/Map] Initial Map Move Complete';
export const MAP_LOADED = '[Features/Peer/Map] Map Loaded';
export const RESET_STATE = '[Features/Peer/Map] Reset State';

export class LoadPeerMapData implements Action {
  readonly type = LOAD_PEER_MAP_DATA;
  readonly payload = null;
}

export class LoadPeerMapDataSuccess implements Action {
  readonly type = LOAD_PEER_MAP_DATA_SUCCESS;

  constructor(public payload: ExchangeMapResponse) {}
}

export class LoadPeerMapDataError implements Action {
  readonly type = LOAD_PEER_MAP_DATA_ERROR;
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

export class ResetState implements Action {
  readonly type = RESET_STATE;
}

export type Actions
  = LoadPeerMapData
  | LoadPeerMapDataSuccess
  | LoadPeerMapDataError
  | UpdatePeerMapFilterBounds
  | InitialMapMoveComplete
  | MapLoaded
  | ResetState;
