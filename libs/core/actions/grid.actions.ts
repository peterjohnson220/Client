import { Action } from '@ngrx/store';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';

import { GridTypeEnum } from '../../models/common';

export class GridAction implements Action {
  readonly type: string;
  readonly gridType: GridTypeEnum;
}

export const UPDATE_GRID = '[Grid Action/Update] Update Grid State Action';
export const RESET_GRID = '[Grid Action/Reset] Reset Grid Action';
export const TOGGLE_ROW_SELECTION = '[Grid Action/Toggle Row Selection] Select/Deselect Grid Row Action';
export const SET_SELECTIONS = '[Grid Action/Toggle Row Selection] Set Selections Action';
export const TOGGLE_SELECT_ALL = '[Grid Action/Toggle Select All] Select/Deselect All';
export const SET_SELECT_ALL_STATE = '[Grid Action/Set Select All State] Set Select All State';
export const UPDATE_FILTER = '[Grid Action/Update Filter] Update Filter Action';
export const PAGE_CHANGE = '[Grid Action/Page Change] Page Change Action';
export const SORT_CHANGE = '[Grid Action/Sort Change] Sort Change Action';


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

  constructor(public gridType: GridTypeEnum, public payload: number, public pageEntityIds: number[] = null) {
    this.type = `${gridType}_${TOGGLE_ROW_SELECTION}`;
  }
}

export class SetSelections implements GridAction {
  readonly type: string;

  constructor(public gridType: GridTypeEnum, public payload: number[], public pageEntityIds: number[] = null) {
    this.type = `${gridType}_${SET_SELECTIONS}`;
  }
}

export class ToggleSelectAll implements GridAction {
  readonly type: string;

  constructor(public gridType: GridTypeEnum, public payload: number[]) {
    this.type = `${gridType}_${TOGGLE_SELECT_ALL}`;
  }
}

export class SetSelectAllState implements GridAction {
  readonly type: string;

  constructor(public gridType: GridTypeEnum, public payload: number[]) {
    this.type = `${gridType}_${SET_SELECT_ALL_STATE}`;
  }
}

export class UpdateFilter implements GridAction {
  readonly type: string;

  constructor(public gridType: GridTypeEnum, public payload: any) {
    this.type = `${gridType}_${UPDATE_FILTER}`;
  }
}

export class PageChange implements GridAction {
  readonly type: string;

  constructor(public gridType: GridTypeEnum, public payload: PageChangeEvent) {
    this.type = `${gridType}_${PAGE_CHANGE}`;
  }
}

export class SortChange implements GridAction {
  readonly type: string;

  constructor(public gridType: GridTypeEnum, public payload: SortDescriptor[]) {
    this.type = `${gridType}_${SORT_CHANGE}`;
  }
}


export type GridActions = UpdateGrid
  | ResetGrid
  | ToggleRowSelection
  | ToggleSelectAll
  | SetSelections
  | SetSelectAllState
  | UpdateFilter
  | PageChange
  | SortChange;
