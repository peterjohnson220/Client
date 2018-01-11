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

const getGridReducer = (gridType: GridTypeEnum, initialState: IGridState = initialGridState) => {
  return (state = initialState, action: GridActions): IGridState => {
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
          ...initialState
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
        newGridState.sort = payload;
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

export const createGridReducer = (gridType: GridTypeEnum, featureReducer: ActionReducerMap<any>, gridStateOverride?: any) => {
  const initState = {
    ...initialGridState,
    grid: {
      ...initialGridState.grid,
      ...gridStateOverride
    }
  };
  return combineReducers({
    feature: featureReducer,
    grid: getGridReducer(gridType, initState)
  });
};

// Selector Functions
export const getGridState = (state: IGridState) => state.grid;
export const getGridSelections = (state: IGridState) => state.selections;
