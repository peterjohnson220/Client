import { Action } from '@ngrx/store';

import { DashboardTile  } from 'libs/models/dashboard/dashboard-tile.model';

export const LOADING_TILES =  '[Main Dashboard/Tiles] Loading Tiles';
export const LOADING_TILES_SUCCESS =  '[Main Dashboard/Tiles] Loading Tiles Success';
export const LOADING_TILES_ERROR =  '[Main Dashboard/Tiles] Loading Tiles Error';

export class LoadingTiles implements Action {
  readonly type = LOADING_TILES;
}

export class LoadingTilesSuccess implements Action {
  readonly type = LOADING_TILES_SUCCESS;

  constructor(public payload: DashboardTile[]) {}
}

export class LoadingTilesError implements Action {
  readonly type = LOADING_TILES_ERROR;
}

export type Actions
  = LoadingTiles
  | LoadingTilesSuccess
  | LoadingTilesError;
