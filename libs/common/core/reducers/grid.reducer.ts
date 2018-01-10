import { GridActions } from '../actions/grid.actions';
import { State } from '@progress/kendo-data-query/';
import { combineReducers } from '@ngrx/store';
import { ActionReducerMap } from '@ngrx/store/src/models';
import * as fromGridActions from 'libs/common/core/actions/grid.actions';
import { GridTypeEnum } from '../../../models/common';
import { KendoGridFilterHelper } from '../helpers';

export interface IFeatureGridState<T> {
  feature: T;
  grid: IGridState;
}

export interface IGridState {
  grid: State;
  selections: any [];
}

// Create entity adapter
export const initialGridState: IGridState = {
  grid: {
    skip: 0,
    take: 10,
    filter: {
      filters: [],
      logic: 'and'
    },
    sort: []
  },
  selections: []
};

export const createGridReducer = (gridType: GridTypeEnum, featureReducer: ActionReducerMap<any>) => {
  return combineReducers({
    feature: featureReducer,
    grid: getGridReducer(gridType)
  });
};

const getGridReducer = (gridType: GridTypeEnum) => {
  return (state = initialGridState, action: GridActions): IGridState => {
    switch (action.type) {
      case `${gridType}_${fromGridActions.UPDATE_GRID}`: {
        const gridState: State = action.payload;
        const newState = {
          ...state,
          grid: gridState
        };
        return newState;
      }
      case `${gridType}_${fromGridActions.RESET_GRID}`: {
        return {
          ...initialGridState
        };
      }
      case `${gridType}_${fromGridActions.TOGGLE_ROW_SELECTION}`: {
        let newSelections = JSON.parse(JSON.stringify(state.selections));
        const selectedRow = action.payload;
        const rowIsSelected = newSelections.indexOf(selectedRow) >= 0;
        if (rowIsSelected) {
          newSelections = newSelections.filter(selection => selection !== selectedRow);
        } else {
          newSelections.push(selectedRow);
        }
        return {
          ...state,
          selections: newSelections
        };
      }
      case `${gridType}_${fromGridActions.UPDATE_FILTER}`: {
        const newGridState = JSON.parse(JSON.stringify(state.grid));
        const payload = action.payload;
        KendoGridFilterHelper.updateFilter(payload.columnName, payload.value, newGridState);
        newGridState.skip = 0;
        return {
          ...state,
          grid: newGridState
        };
      }
      case `${gridType}_${fromGridActions.PAGE_CHANGE}`: {
        const newGridState = JSON.parse(JSON.stringify(state.grid));
        const payload = action.payload;
        newGridState.skip = payload.skip;
        return {
          ...state,
          grid: newGridState
        };
      }
      case `${gridType}_${fromGridActions.SORT_CHANGE}`: {
        const newGridState = JSON.parse(JSON.stringify(state.grid));
        const payload = action.payload;
        newGridState.skip = 0;
        newGridState.sort = payload.sort;
        return {
          ...state,
          grid: newGridState
        };
      }
      default: {
        return state;
      }
    }
  };
};

// Selector Functions
export const getGridState = (state: IGridState) => state.grid;
export const getGridSelections = (state: IGridState) => state.selections;
