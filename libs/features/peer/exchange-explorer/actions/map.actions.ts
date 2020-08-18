import { Action } from '@ngrx/store';

import { ExchangeMapResponse, MapGeoData } from 'libs/models/';
import { ExchangeExplorerScopeResponse } from 'libs/models/payfactors-api/peer/exchange-data-filter/response';
import { LngLatBounds } from 'mapbox-gl';

export const LOAD_PEER_MAP_DATA  = '[Features/Peer/ExchangeExplorer/Map] Load Peer Map Data';
export const LOAD_PEER_MAP_DATA_SUCCESS  = '[Features/Peer/ExchangeExplorer/Map] Load Peer Map Data Success';
export const LOAD_PEER_MAP_DATA_ERROR  = '[Features/Peer/ExchangeExplorer/Map] Load Peer Map Data Error';
export const UPDATE_PEER_MAP_FILTER_BOUNDS = '[Features/Peer/ExchangeExplorer/Map] Update Peer Map Filter Bounds';
export const MAP_LOADED = '[Features/Peer/ExchangeExplorer/Map] Map Loaded';
export const RESET_STATE = '[Features/Peer/ExchangeExplorer/Map] Reset State';
export const RESET_INITIALLY_LOADED_STATE = '[Features/Peer/ExchangeExplorer/Map] Reset Initially Loaded State';
export const APPLY_CUT_CRITERIA = '[Features/Peer/ExchangeExplorer/Map] Apply Cut Criteria';
export const APPLY_SCOPE_CRITERIA = '[Features/Peer/ExchangeExplorer/Map] Apply Scope Criteria';
export const APPLY_SCOPE_CRITERIA_SUCCESS = '[Features/Peer/ExchangeExplorer/Map] Apply Scope Criteria Success';
export const CLEAR_MAP_FILTER_BOUNDS = '[Features/Peer/ExchangeExplorer/Map] Clear Map Filter Bounds';
export const AUTO_ZOOM_COMPLETE = '[Features/Peer/ExchangeExplorer/Map] Auto Zoom Complete';

export const SET_PEER_MAP_BOUNDS = '[Features/Peer/ExchangeExplorer/Map] Set Peer Map Bounds';
export const MOVE_END = '[Features/Peer/ExchangeExplorer/Map] Move End';
export const INITIAL_ZOOM_COMPLETE = '[Features/Peer/ExchangeExplorer/Map] Initial Zoom Complete';


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

export class MapLoaded implements Action {
  readonly type = MAP_LOADED;
}

export class ResetState implements Action {
  readonly type = RESET_STATE;
}

export class ResetInitiallyLoadedState implements Action {
  readonly type = RESET_INITIALLY_LOADED_STATE;
}

export class ApplyCutCriteria implements Action {
  readonly type = APPLY_CUT_CRITERIA;

  constructor(public payload: ExchangeExplorerScopeResponse) {}
}

export class ApplyScopeCriteria implements Action {
  readonly type = APPLY_SCOPE_CRITERIA;

  constructor(public payload: ExchangeExplorerScopeResponse) {}
}

export class ApplyScopeCriteriaSuccess implements Action {
  readonly type = APPLY_SCOPE_CRITERIA_SUCCESS;
}

export class ClearMapFilterBounds implements Action {
  readonly type = CLEAR_MAP_FILTER_BOUNDS;
}

export class AutoZoomComplete implements Action {
  readonly type = AUTO_ZOOM_COMPLETE;
}

export class SetPeerMapBounds implements Action {
  readonly type = SET_PEER_MAP_BOUNDS;

  constructor(public payload: MapGeoData) {}
}

export class MoveEnd implements Action {
  readonly type = MOVE_END;

  constructor(public payload: { bounds: LngLatBounds, zoom: number }) {}
}

export class InitialZoomComplete implements Action {
  readonly type = INITIAL_ZOOM_COMPLETE;

  constructor() {}
}


export type Actions
  = LoadPeerMapData
  | LoadPeerMapDataSuccess
  | LoadPeerMapDataError
  | UpdatePeerMapFilterBounds
  | InitialZoomComplete
  | MapLoaded
  | ResetState
  | ResetInitiallyLoadedState
  | ApplyCutCriteria
  | ApplyScopeCriteria
  | ApplyScopeCriteriaSuccess
  | ClearMapFilterBounds
  | AutoZoomComplete
  | SetPeerMapBounds
  | MoveEnd;
