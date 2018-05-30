import { Action } from '@ngrx/store';
import { Tile } from '../models';
import { ReorderTileRequest } from 'libs/models/dashboard';

export const LOADING_TILES = '[Dashboard Tile Grid/Tiles] Loading Tiles';
export const LOADING_TILES_SUCCESS = '[Dashboard Tile Grid/Tiles] Loading Tiles Success';
export const LOADING_TILES_ERROR = '[Dashboard Tile Grid/Tiles] Loading Tiles Error';

export const LOADING_SINGLE_TILE = '[Dashboard Tile Grid/Tiles] Loading Single Tile';
export const LOADING_SINGLE_TILE_SUCCESS = '[Dashboard Tile Grid/Tiles] Loading Single Tile Success';
export const LOADING_SINGLE_TILE_ERROR = '[Dashboard Tile Grid/Tiles] Loading Single Tile Error';

export const REORDER_TILES = '[Dashboard Tile Grid/Tiles] Reorder Tiles';
export const REORDER_TILES_SUCCESS = '[Dashboard Tile Grid/Tiles] Reorder Tiles Success';
export const REORDER_TILES_ERROR = '[Dashboard Tile Grid/Tiles] Reorder Tiles Error';

export class LoadingTiles implements Action {
  readonly type = LOADING_TILES;

  constructor(public includeTilePreviewData: boolean) {
  }
}

export class LoadingTilesSuccess implements Action {
  readonly type = LOADING_TILES_SUCCESS;

  constructor(public payload: Tile[]) {
  }
}

export class LoadingTilesError implements Action {
  readonly type = LOADING_TILES_ERROR;

  constructor(public any: Error) {
  }
}

export class LoadingSingleTile implements Action {
  readonly type = LOADING_SINGLE_TILE;

  constructor(public tileId: number) {
  }
}

export class LoadingSingleTileSuccess implements Action {
  readonly type = LOADING_SINGLE_TILE_SUCCESS;

  constructor(public payload: Tile[]) {}

}

export class LoadingSingleTileError implements Action {
  readonly type = LOADING_SINGLE_TILE_ERROR;

  constructor(public any: Error) {
  }
}

export class ReorderTiles implements Action {
  readonly type = REORDER_TILES;

  constructor(public payload: ReorderTileRequest) {
  }
}

export class ReorderTilesSuccess implements Action {
  readonly type = REORDER_TILES_SUCCESS;

  constructor(public payload: Tile[]) {
  }
}

export class ReorderTilesError implements Action {
  readonly type = REORDER_TILES_ERROR;

  constructor(public payload: string) {
  }
}

export type Actions
  = LoadingTiles
  | LoadingTilesSuccess
  | LoadingTilesError
  | LoadingSingleTile
  | LoadingSingleTileSuccess
  | LoadingSingleTileError
  | ReorderTiles
  | ReorderTilesSuccess
  | ReorderTilesError;
