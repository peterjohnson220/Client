import * as fromPfGridActions from '../actions';
import { ViewField } from 'libs/models/payfactors-api';
import { GridDataResult } from '@progress/kendo-angular-grid';

export interface DataGridState {
    pageViewId: string;
    loading: boolean;
    baseEntityId: number;
    fields: ViewField[];
    data: any[];
    pageSize: number;
    skip: number;
    total: number;
}

export interface DataGridStoreState {
    grids: { [key: string]: DataGridState };
}

const initialState: DataGridStoreState = {
    grids: {}
};

export function reducer(state = initialState, action: fromPfGridActions.DataGridActions): DataGridStoreState {
    switch (action.type) {
        case fromPfGridActions.LOAD_VIEW_CONFIG:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.pageViewId]: {
                        ...state.grids[action.pageViewId],
                        pageViewId: action.pageViewId,
                        loading: true,
                        pageSize: 15,
                        skip: 0,
                        total: 1500
                    }
                }
            };
        case fromPfGridActions.LOAD_VIEW_CONFIG_SUCCESS:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.pageViewId]: {
                        ...state.grids[action.pageViewId],
                        fields: action.payload.Fields,
                        baseEntityId: action.payload.EntityId,
                        loading: false
                    }
                }
            };
        case fromPfGridActions.LOAD_DATA:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.pageViewId]: {
                        ...state.grids[action.pageViewId],
                        loading: true
                    }
                }
            };
        case fromPfGridActions.LOAD_DATA_SUCCESS:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.pageViewId]: {
                        ...state.grids[action.pageViewId],
                        data: action.payload,
                        loading: false
                    }
                }
            };
        case fromPfGridActions.UPDATE_FIELDS:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.pageViewId]: {
                        ...state.grids[action.pageViewId],
                        fields: action.fields,
                    }
                }
            };
        case fromPfGridActions.UPDATE_TOTAL_COUNT:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.pageViewId]: {
                        ...state.grids[action.pageViewId],
                        total: action.totalCount,
                    }
                }
            };
        case fromPfGridActions.UPDATE_PAGE_SIZE:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.pageViewId]: {
                        ...state.grids[action.pageViewId],
                        pageSize: action.pageSize,
                    }
                }
            };
        case fromPfGridActions.UPDATE_SKIP:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.pageViewId]: {
                        ...state.grids[action.pageViewId],
                        skip: action.skip,
                    }
                }
            };
        case fromPfGridActions.HANDLE_API_ERROR:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.pageViewId]: {
                        ...state.grids[action.pageViewId],
                        loading: false
                    }
                }
            };
        default:
            return state;
    }
}

export const getState = (state: DataGridStoreState) => state;
export const getGrid = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId];
export const getLoading = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].loading : null;
export const getBaseEntityId = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].baseEntityId : null;
export const getFields = (state: DataGridStoreState, pageViewId: string) =>
  state.grids[pageViewId] ? state.grids[pageViewId].fields : null;
export const getGlobalFilters = (state: DataGridStoreState, pageViewId: string) =>
  state.grids[pageViewId] &&  state.grids[pageViewId].fields ? state.grids[pageViewId].fields.filter(f => f.IsGlobalFilter) : null;
export const getPageSize = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].pageSize : null;
export const getSkip = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].skip : null;
export const getTotal = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].total : null;
export const getData = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].data : null;
export const getGridData = (state: DataGridStoreState, pageViewId: string) => buildGridData(state, pageViewId);

export function buildGridData(state: DataGridStoreState, pageViewId: string): GridDataResult {

    if (state.grids[pageViewId] && state.grids[pageViewId].data) {
        const gridState = <DataGridState>state.grids[pageViewId];
        return {
            data: gridState.data.slice(gridState.skip, gridState.skip + gridState.pageSize),
            total: gridState.total
        };
    }
    return null;
}

