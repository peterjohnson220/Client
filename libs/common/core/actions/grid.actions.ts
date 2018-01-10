import { Action } from '@ngrx/store';
import { GridTypeEnum } from '../../../models/common';

export class GridAction implements Action {
  readonly type: string;
  readonly gridType: GridTypeEnum;
}

export const UPDATE_GRID = '[Grid Action/Update] Update Grid State Action';
export const RESET_GRID = '[Grid Action/Reset] Reset Grid Action';
export const TOGGLE_ROW_SELECTION = '[Grid Action/Toggle Row Selection] Select/Deselect Grid Row Action'


export class UpdateGrid implements GridAction {
  readonly type: string;

  constructor(public gridType: GridTypeEnum, public payload: any) {
    this.type = `${gridType}_${UPDATE_GRID}`;
  }
}

export class ResetGrid implements GridAction {
  readonly type: string;
  readonly payload: any;

  constructor(public gridType: GridTypeEnum) {
    this.type = `${gridType}_${RESET_GRID}`;
  }
}

export class ToggleRowSelection implements GridAction {
  readonly type: string;

  constructor(public gridType: GridTypeEnum, public payload: any) {
    this.type = `${gridType}_${TOGGLE_ROW_SELECTION}`;
  }
}

export type GridActions = UpdateGrid
  | ResetGrid
  | ToggleRowSelection;

