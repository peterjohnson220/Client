import { Action } from '@ngrx/store';

import { Tile } from '../models';

export const LOADING_TILES =  '[Dashboard Tile Grid/Tiles] Loading Tiles';
export const LOADING_TILES_SUCCESS =  '[Dashboard Tile Grid/Tiles] Loading Tiles Success';
export const LOADING_TILES_ERROR =  '[Dashboard Tile Grid/Tiles] Loading Tiles Error';

export class LoadingTiles implements Action {
  readonly type = LOADING_TILES;
}

export class LoadingTilesSuccess implements Action {
  readonly type = LOADING_TILES_SUCCESS;

  constructor(public payload: Tile[]) {}
}

export class LoadingTilesError implements Action {
  readonly type = LOADING_TILES_ERROR;

  constructor(public any: Error) {}
}

export type Actions
  = LoadingTiles
  | LoadingTilesSuccess
  | LoadingTilesError;
