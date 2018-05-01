import { State } from '@progress/kendo-data-query/';
import { combineReducers } from '@ngrx/store';
import * as cloneDeep from 'lodash.clonedeep';

import * as fromGridActions from 'libs/core/actions/grid.actions';

import { GridActions } from '../actions/grid.actions';
import { KendoGridFilterHelper } from '../helpers';
import { GridTypeEnum } from '../../models/common';

export interface IFeatureGridState<T> {
  feature: T;
  grid: IGridState;
}

export interface IGridState {
  grid: State;
  selections: any [];
}

export const initialGridState: IGridState = {
  grid: {
    skip: 0,
    take: 20,
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
        const gridState: State = cloneDeep(action.payload);
        // We do not currently support multiple filter operations in a given filter, but kendo assumes we do.
        // Take the first FilterDescriptor from each CompositeFilter so that it is parsed correctly by the server.
        gridState.filter.filters = gridState.filter.filters.map((f: any) => f.filters ? f.filters[0] : f);
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
        let newSelections = cloneDeep(state.selections);
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
        const newGridState = cloneDeep(state.grid);
        const payload = action.payload;
        KendoGridFilterHelper.updateFilter(payload.columnName, payload.value, newGridState);
        newGridState.skip = 0;
        return {
          ...state,
          grid: newGridState
        };
      }
      case `${gridType}_${fromGridActions.PAGE_CHANGE}`: {
        const newGridState = cloneDeep(state.grid);
        const payload = action.payload;
        newGridState.skip = payload.skip;
        return {
          ...state,
          grid: newGridState
        };
      }
      case `${gridType}_${fromGridActions.SORT_CHANGE}`: {
        const newGridState = cloneDeep(state.grid);
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

export const createGridReducer = (gridType: GridTypeEnum, featureReducer: any, gridStateOverride?: any) => {
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
