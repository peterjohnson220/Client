import { cloneDeep } from 'lodash';
import { arraySortByString, SortDirection } from 'libs/core/functions';
import * as fromPfGridActions from '../actions';
import { ViewField, PagingOptions, DataViewFilter } from 'libs/models/payfactors-api';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { groupBy, GroupResult } from '@progress/kendo-data-query';
import { DataViewConfig } from '../../../models/payfactors-api';

export interface DataGridState {
    pageViewId: string;
    loading: boolean;
    baseEntityId: number;
    fields: ViewField[];
    groupedFields: any[];
    filters: DataViewFilter[];
    filterPanelOpen: boolean;
    saveViewModalOpen: boolean;
    savedViews: DataViewConfig[];
    viewIsSaving: boolean;
    data: GridDataResult;
    pagingOptions: PagingOptions;
}

export interface DataGridStoreState {
    grids: { [key: string]: DataGridState };
}

const INITIAL_STATE: DataGridStoreState = {
    grids: {}
};

export const DEFAULT_PAGING_OPTIONS: PagingOptions = {
  From: 0,
  Count: 20
};

export function reducer(state = INITIAL_STATE, action: fromPfGridActions.DataGridActions): DataGridStoreState {
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
                        pagingOptions: DEFAULT_PAGING_OPTIONS,
                        filters: []
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
                        groupedFields: buildGroupedFields(action.payload.Fields),
                        baseEntityId: action.payload.EntityId,
                        loading: false,
                        filters: action.payload.Filters
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
                        data: {
                            data: action.payload.Data,
                            total: action.payload.TotalCount
                        },
                        loading: false,
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
                        groupedFields: buildGroupedFields(action.fields),
                    }
                }
            };
        case fromPfGridActions.UPDATE_PAGING_OPTIONS:
            return {
                ...state,
                grids: {
                    ...state.grids,
                    [action.pageViewId]: {
                        ...state.grids[action.pageViewId],
                        pagingOptions: action.pagingOptions,
                        loading: true
                    },
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
      case fromPfGridActions.UPDATE_FILTER:
        const newFilters = cloneDeep(state.grids[action.pageViewId].filters);
        const filterForThisField = state.grids[action.pageViewId].filters.find(f => f.SourceName === action.payload.SourceName);

        if (filterForThisField) {
          const thisFilterIndex = state.grids[action.pageViewId].filters.findIndex(f => f.SourceName === action.payload.SourceName);
          newFilters.splice(thisFilterIndex, 1, action.payload);
        } else {
          newFilters.push(action.payload);
        }
        return {
          ...state,
          grids: {
            ...state.grids,
            [action.pageViewId]: {
              ...state.grids[action.pageViewId],
              filters: newFilters
            }
          }
        };
      case fromPfGridActions.CLEAR_FILTER:
        const clonedFilters = cloneDeep(state.grids[action.pageViewId].filters);
        const filterToRemove = state.grids[action.pageViewId].filters.find(f => f.SourceName === action.payload.SourceName);
        return {
          ...state,
          grids: {
            ...state.grids,
            [action.pageViewId]: {
              ...state.grids[action.pageViewId],
              filters: clonedFilters.filter(nf => nf.SourceName !== filterToRemove.SourceName)
            }
          }
        };
      case fromPfGridActions.CLEAR_ALL_FILTERS:
        return {
          ...state,
          grids: {
            ...state.grids,
            [action.pageViewId]: {
              ...state.grids[action.pageViewId],
              filters: []
            }
          }
        };
      case fromPfGridActions.TOGGLE_FILTER_PANEL:
        return {
          ...state,
          grids: {
            ...state.grids,
            [action.pageViewId]: {
              ...state.grids[action.pageViewId],
              filterPanelOpen: !state.grids[action.pageViewId].filterPanelOpen
            }
          }
        };
      case fromPfGridActions.SET_FILTER_PANEL_DISPLAY:
        return {
          ...state,
          grids: {
            ...state.grids,
            [action.pageViewId]: {
              ...state.grids[action.pageViewId],
              filterPanelOpen: action.displayValue
            }
          }
        }
      case fromPfGridActions.LOAD_SAVED_VIEWS_SUCCESS:
        return {
          ...state,
          grids: {
            ...state.grids,
            [action.pageViewId]: {
              ...state.grids[action.pageViewId],
              savedViews: action.payload
            }
          }
        };
      case fromPfGridActions.OPEN_SAVE_VIEW_MODAL:
        return {
          ...state,
          grids: {
            ...state.grids,
            [action.pageViewId]: {
              ...state.grids[action.pageViewId],
              saveViewModalOpen: true
            }
          }
        };

      case fromPfGridActions.CLOSE_SAVE_VIEW_MODAL:
        return {
          ...state,
          grids: {
            ...state.grids,
            [action.pageViewId]: {
              ...state.grids[action.pageViewId],
              saveViewModalOpen: false
            }
          }
        };
      case fromPfGridActions.SAVE_VIEW:
        return {
          ...state,
          grids: {
            ...state.grids,
            [action.pageViewId]: {
              ...state.grids[action.pageViewId],
              viewIsSaving: true
            }
          }
        };
      case fromPfGridActions.SAVE_VIEW_SUCCESS:
        console.log(action.payload);
        const views = cloneDeep(state.grids[action.pageViewId].savedViews);
        views.push(action.payload);
        return {
          ...state,
          grids: {
            ...state.grids,
            [action.pageViewId]: {
              ...state.grids[action.pageViewId],
              saveViewModalOpen: false,
              viewIsSaving: false,
              savedViews: views.sort((a, b) => arraySortByString(a.Name, b.Name, SortDirection.Ascending))
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
export const getFields = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].fields : null;
export const getGroupedFields = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].groupedFields : null;
export const getGlobalFilters = (state: DataGridStoreState, pageViewId: string) => {
    return state.grids[pageViewId] && state.grids[pageViewId].fields ? state.grids[pageViewId].fields.filter(f => f.IsGlobalFilter) : null;
};
export const getPagingOptions = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].pagingOptions : null;
export const getData = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId] ? state.grids[pageViewId].data : null;
export const getFilters = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].filters;
export const getFilterPanelDisplay = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].filterPanelOpen;
export const getSavedViews = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].savedViews;
export const getSaveViewModalOpen = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].saveViewModalOpen;
export const getViewIsSaving = (state: DataGridStoreState, pageViewId: string) => state.grids[pageViewId].viewIsSaving;

export function buildGroupedFields(fields: ViewField[]): any[] {
    const groups = groupBy(fields, [{ field: 'Group' }]);
    const orderedGroups = (groups as Array<GroupResult>)
        .filter(g => g.value)
        .map(g => ({
            'Order': Math.min(...g.items.map(c => (c as ViewField).Order)),
            'Group': g.value,
            'Fields': g.items
        }));

    const result: any[] = (groups as Array<GroupResult>).filter(g => g.value == null)[0].items;
    orderedGroups.forEach(function (group) {
        result.push(group);
    });
    result.sort((a, b) => {
      if (a.Order > b.Order) {
        return 1;
      } else if (b.Order > a.Order) {
        return -1;
      } else {
        return 0;
      }
    });
    return result;
}
