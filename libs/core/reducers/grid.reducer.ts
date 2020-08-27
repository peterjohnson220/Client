import { State } from '@progress/kendo-data-query/';
import { SelectAllCheckboxState } from '@progress/kendo-angular-grid';
import { combineReducers } from '@ngrx/store';
import cloneDeep from 'lodash/cloneDeep';

import * as fromGridActions from 'libs/core/actions/grid.actions';

import {GridActions, SetSelections, ToggleRowSelection} from '../actions/grid.actions';
import { KendoGridFilterHelper } from '../helpers';
import { GridTypeEnum } from '../../models/common';

export interface IFeatureGridState<T> {
  feature: T;
  grid: IGridState;
}

export interface IGridState {
  grid: State;
  selections: any [];
  selectAllState: SelectAllCheckboxState;
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
  selections: [],
  selectAllState: 'unchecked'
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

        const toggleRowSelectionAction = action as ToggleRowSelection;
        const selectedRow = toggleRowSelectionAction.payload;
        const entityIdsOnPage = toggleRowSelectionAction.pageEntityIds;
        const rowIsSelected = newSelections.indexOf(selectedRow) >= 0;

        if (rowIsSelected) {
          newSelections = newSelections.filter(selection => selection !== selectedRow);
        } else {
          newSelections.push(selectedRow);
        }

        let newSelectAllState: SelectAllCheckboxState = state.selectAllState;
        if (!!entityIdsOnPage) {
          newSelectAllState = getSelectAllState(newSelections, entityIdsOnPage);
        }
        return {
          ...state,
          selections: newSelections,
          selectAllState: newSelectAllState
        };
      }
      case `${gridType}_${fromGridActions.TOGGLE_SELECT_ALL}`: {
        let selectionsCopy: number[] = cloneDeep(state.selections);

        const entityIdsOnPage = action.payload;
        const newState = {...state};
        const existingPageSelections = selectionsCopy.filter(s => entityIdsOnPage.indexOf(s) > -1);
        const shouldSelectAll = state.selectAllState !== 'checked' && entityIdsOnPage.length > existingPageSelections.length;

        if (shouldSelectAll) {
          const selectionsToAdd = entityIdsOnPage.filter(e => selectionsCopy.indexOf(e) < 0);
          selectionsCopy = selectionsCopy.concat(selectionsToAdd);
          newState.selections = selectionsCopy;
          newState.selectAllState = 'checked';
        } else {
          newState.selections = selectionsCopy.filter(ns => entityIdsOnPage.indexOf(ns) < 0);
          newState.selectAllState = 'unchecked';
        }

        return newState;
      }
      case `${gridType}_${fromGridActions.SET_SELECTIONS}`: {
        const setAction = action as SetSelections;
        const selections = setAction.payload;
        const entityIdsOnPage = setAction.pageEntityIds;

        let newSelectAllState: SelectAllCheckboxState = state.selectAllState;

        if (!!entityIdsOnPage) {
          newSelectAllState = getSelectAllState(selections, entityIdsOnPage);
        }
        return {
          ...state,
          selections: selections,
          selectAllState: newSelectAllState
        };
      }
      case `${gridType}_${fromGridActions.SET_SELECT_ALL_STATE}`: {
        const entityIdsOnPage = action.payload;
        const selectionsCopy = cloneDeep(state.selections);

        return {
          ...state,
          selections: selectionsCopy,
          selectAllState: getSelectAllState(selectionsCopy, entityIdsOnPage)
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
export const getGridSelectAllState = (state: IGridState) => state.selectAllState;

// Helper Functions
function getSelectAllState(newSelections, entityIdsOnPage): SelectAllCheckboxState {
  const existingPageSelections = newSelections.filter(s => entityIdsOnPage.indexOf(s) > -1);
  const allSelected = existingPageSelections.length === entityIdsOnPage.length;
  const hasNoSelections = existingPageSelections.length === 0;

  if (allSelected && !hasNoSelections) {
    return 'checked';
  }

  return hasNoSelections ? 'unchecked' : 'indeterminate';
}
