import { cloneDeep } from 'lodash';
import * as fromPfGridActions from '../actions';
import { PfDataGridFieldModel, PfGridFieldFilter } from 'libs/models';

export interface DataGridState {
    entity: string;
    loading: boolean;
    fields: PfDataGridFieldModel[];
    filters: PfGridFieldFilter[];
    data: any;
}

export interface DataGridStoreState {
    grids: { [key: string]: DataGridState };
}

const initialState: DataGridStoreState = {
    grids: {}
};

export function reducer(state = initialState, action: fromPfGridActions.DataGridActions): DataGridStoreState {
    switch (action.type) {
        case fromPfGridActions.INIT_GRID:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.entity]: {
                        ...state.grids[action.entity],
                        entity: action.entity,
                        filters: []
                    }
                }
            };
        case fromPfGridActions.LOAD_FIELDS_SUCCESS:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.entity]: {
                        ...state.grids[action.entity],
                        fields: action.payload,
                    }
                }
            };
        case fromPfGridActions.LOAD_DATA_SUCCESS:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.entity]: {
                        ...state.grids[action.entity],
                        data: action.payload,
                    }
                }
            };
        case fromPfGridActions.UPDATE_FIELDS:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.entity]: {
                        ...state.grids[action.entity],
                        fields: action.fields,
                    }
                }
            };
      case fromPfGridActions.UPDATE_FILTER:
        const newFilters = cloneDeep(state.grids[action.entity].filters);
        const filterForThisField = state.grids[action.entity].filters.find(f => f.SourceName === action.payload.SourceName);

        if (filterForThisField) {
          const thisFilterIndex = state.grids[action.entity].filters.findIndex(f => f.SourceName === action.payload.SourceName);
          newFilters.splice(thisFilterIndex, 1, action.payload);
        } else {
          newFilters.push(action.payload);
        }
        return {
          ...state,
          grids: {
            ...state.grids,
            [action.entity]: {
              ...state.grids[action.entity],
              filters: newFilters
            }
          }
        };
      case fromPfGridActions.CLEAR_FILTER:
        const clonedFilters = cloneDeep(state.grids[action.entity].filters);
        const filterToRemove = state.grids[action.entity].filters.find(f => f.SourceName === action.payload.SourceName);
        return {
          ...state,
          grids: {
            ...state.grids,
            [action.entity]: {
              ...state.grids[action.entity],
              filters: clonedFilters.filter(nf => nf.SourceName !== filterToRemove.SourceName)
            }
          }
        };
      case fromPfGridActions.CLEAR_ALL_FILTERS:
        return {
          ...state,
          grids: {
            ...state.grids,
            [action.entity]: {
              ...state.grids[action.entity],
              filters: []
            }
          }
        };
        default:
            return state;
    }
}

export const getState = (state: DataGridStoreState) => state;
export const getGrid = (state: DataGridStoreState, entity: string) => state.grids[entity];
export const getFields = (state: DataGridStoreState, entity: string) => state.grids[entity].fields;
export const getData = (state: DataGridStoreState, entity: string) => state.grids[entity].data;
export const getFilters = (state: DataGridStoreState, entity: string) => state.grids[entity].filters;
