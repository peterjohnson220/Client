import { Action } from '@ngrx/store';

import { UserTile } from '../models';

export const GET_USER_TILES  = '[User Settings / User Settings Page] Get User Tiles';
export const GET_USER_TILES_SUCCESS  = '[User Settings / User Settings Page] Get User Tiles Success';
export const GET_USER_TILES_ERROR  = '[User Settings / User Settings Page] Get User Tiles Error';
export const TOGGLE_USER_TILE = '[User Settings / User Settings Page] Toggle User Tile';
export const SAVE_DASHBOARD_PREFERENCES = '[User Settings / User Settings Page] Save Dashboard Preferences Tiles';
export const SAVE_DASHBOARD_PREFERENCES_SUCCESS = '[User Settings / User Settings Page] Save Dashboard Preferences Success';
export const SAVE_DASHBOARD_PREFERENCES_ERROR = '[User Settings / User Settings Page] Save Dashboard Preferences Error';
export const CANCEL_DASHBOARD_PREFERENCES_CHANGES = '[User Settings / User Settings Page] Cancel Dashboard Preferences Changes';

export class GetUserTiles implements Action {
  readonly type = GET_USER_TILES;

  constructor() {}
}

export class GetUserTilesSuccess implements Action {
  readonly type = GET_USER_TILES_SUCCESS;

  constructor(public payload: UserTile[]) {}
}

export class GetUserTilesError implements Action {
  readonly type = GET_USER_TILES_ERROR;

  constructor() {}
}

export class ToggleUserTile implements Action {
  readonly type = TOGGLE_USER_TILE;

  constructor(public payload: UserTile) {}
}

export class SaveDashboardPreferences implements Action {
  readonly type = SAVE_DASHBOARD_PREFERENCES;

  constructor() {}
}

export class SaveDashboardPreferencesSuccess implements Action {
  readonly type = SAVE_DASHBOARD_PREFERENCES_SUCCESS;

  constructor() {}
}

export class SaveDashboardPreferencesError implements Action {
  readonly type = SAVE_DASHBOARD_PREFERENCES_ERROR;

  constructor() {}
}

export class CancelDashboardPreferencesChanges implements Action {
  readonly type = CANCEL_DASHBOARD_PREFERENCES_CHANGES;

  constructor() {}
}

export type Actions
  = GetUserTiles
  | GetUserTilesSuccess
  | GetUserTilesError
  | ToggleUserTile
  | SaveDashboardPreferences
  | SaveDashboardPreferencesSuccess
  | SaveDashboardPreferencesError
  | CancelDashboardPreferencesChanges;
