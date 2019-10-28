import { Action } from '@ngrx/store';

import { ExchangeMapResponse, GenericKeyValue } from 'libs/models/';
import { ExchangeExplorerScopeResponse } from 'libs/models/payfactors-api/peer/exchange-data-filter/response';

export const LOAD_PEER_MAP_DATA  = '[Features/Peer/ExchangeExplorer/Map] Load Peer Map Data';
export const LOAD_PEER_MAP_DATA_SUCCESS  = '[Features/Peer/ExchangeExplorer/Map] Load Peer Map Data Success';
export const LOAD_PEER_MAP_DATA_ERROR  = '[Features/Peer/ExchangeExplorer/Map] Load Peer Map Data Error';
export const UPDATE_PEER_MAP_FILTER_BOUNDS = '[Features/Peer/ExchangeExplorer/Map] Update Peer Map Filter Bounds';
export const INITIAL_MAP_MOVE_COMPLETE = '[Features/Peer/ExchangeExplorer/Map] Initial Map Move Complete';
export const MAP_LOADED = '[Features/Peer/ExchangeExplorer/Map] Map Loaded';
export const RESET_STATE = '[Features/Peer/ExchangeExplorer/Map] Reset State';
export const APPLY_CUT_CRITERIA = '[Features/Peer/ExchangeExplorer/Map] Apply Cut Criteria';
export const APPLY_SCOPE_CRITERIA = '[Features/Peer/ExchangeExplorer/Map] Apply Scope Criteria';
export const APPLY_SCOPE_CRITERIA_SUCCESS = '[Features/Peer/ExchangeExplorer/Map] Apply Scope Criteria Success';
export const CLEAR_MAP_FILTER_BOUNDS = '[Features/Peer/ExchangeExplorer/Map] Clear Map Filter Bounds';
export const LOAD_ZOOM_PRECISION_DICTIONARY = '[Features/Peer/ExchangeExplorer/Map] Load Zoom Precision Dictionary';
export const LOAD_ZOOM_PRECISION_DICTIONARY_SUCCESS = '[Features/Peer/ExchangeExplorer/Map] Load Zoom Precision Dictionary Success';
export const LOAD_ZOOM_PRECISION_DICTIONARY_ERROR = '[Features/Peer/ExchangeExplorer/Map] Load Zoom Precision Dictionary Error';
export const AUTO_ZOOM_COMPLETE = '[Features/Peer/ExchangeExplorer/Map] Auto Zoom Complete';
export const LOAD_PEER_MAP_BOUNDS  = '[Features/Peer/ExchangeExplorer/Map] Load Peer Map Bounds';
export const LOAD_PEER_MAP_BOUNDS_SUCCESS  = '[Features/Peer/ExchangeExplorer/Map] Load Peer Map Bounds Success';
export const LOAD_PEER_MAP_BOUNDS_ERROR  = '[Features/Peer/ExchangeExplorer/Map] Load Peer Map Bounds Error';


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

export class LoadZoomPrecisionDictionary implements Action {
  readonly type = LOAD_ZOOM_PRECISION_DICTIONARY;
}

export class LoadZoomPrecisionDictionarySuccess implements Action {
  readonly type = LOAD_ZOOM_PRECISION_DICTIONARY_SUCCESS;

  constructor(public payload: GenericKeyValue<number, number>[]) {}
}

export class LoadZoomPrecisionDictionaryError implements Action {
  readonly type = LOAD_ZOOM_PRECISION_DICTIONARY_ERROR;
}

export class AutoZoomComplete implements Action {
  readonly type = AUTO_ZOOM_COMPLETE;
}

export class LoadPeerMapBounds implements Action {
  readonly type = LOAD_PEER_MAP_BOUNDS;
  readonly payload = null;
}

export class LoadPeerMapBoundsSuccess implements Action {
  readonly type = LOAD_PEER_MAP_BOUNDS_SUCCESS;

  constructor(public payload: ExchangeMapResponse) {}
}

export class LoadPeerMapBoundsError implements Action {
  readonly type = LOAD_PEER_MAP_BOUNDS_ERROR;
  readonly payload = null;
}

export type Actions
  = LoadPeerMapData
  | LoadPeerMapDataSuccess
  | LoadPeerMapDataError
  | UpdatePeerMapFilterBounds
  | InitialMapMoveComplete
  | MapLoaded
  | ResetState
  | ApplyCutCriteria
  | ApplyScopeCriteria
  | ApplyScopeCriteriaSuccess
  | ClearMapFilterBounds
  | LoadZoomPrecisionDictionary
  | LoadZoomPrecisionDictionarySuccess
  | LoadZoomPrecisionDictionaryError
  | AutoZoomComplete
  | LoadPeerMapBounds
  | LoadPeerMapBoundsSuccess
  | LoadPeerMapBoundsError;
