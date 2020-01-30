import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromDashboardsActions from '../actions/dashboards.actions';
import { DashboardView, View, Workbook } from '../models';
import { DashboardsHelper } from '../helpers';

export interface State {
  companyWorkbooksAsync: AsyncStateObj<Workbook[]>;
  savingTag: boolean;
  savingTagError: boolean;
  tagFilter: string;
  dashboardView: DashboardView;
  tagWorkbookModalOpen: boolean;
  activeWorkbook: Workbook;
  allViewsLoadedAsync: AsyncStateObj<boolean>;
}

const initialState: State = {
  companyWorkbooksAsync: generateDefaultAsyncStateObj<Workbook[]>([]),
  savingTag: false,
  savingTagError: false,
  tagFilter: null,
  dashboardView: DashboardView.All,
  tagWorkbookModalOpen: false,
  activeWorkbook: null,
  allViewsLoadedAsync: generateDefaultAsyncStateObj<boolean>(false)
};

export function reducer(state = initialState, action: fromDashboardsActions.Actions): State {
  switch (action.type) {
    case fromDashboardsActions.GET_COMPANY_WORKBOOKS: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);
      const allViewsAsyncClone = cloneDeep(state.allViewsLoadedAsync);

      companyWorkbooksAsyncClone.loading = true;
      companyWorkbooksAsyncClone.loadingError = false;
      allViewsAsyncClone.obj = false;

      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone,
        allViewsLoadedAsync: allViewsAsyncClone
      };
    }
    case fromDashboardsActions.GET_COMPANY_WORKBOOKS_SUCCESS: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);

      companyWorkbooksAsyncClone.loading = false;
      companyWorkbooksAsyncClone.obj = action.payload;

      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone
      };
    }
    case fromDashboardsActions.GET_COMPANY_WORKBOOKS_ERROR: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);
      companyWorkbooksAsyncClone.loadingError = true;

      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone
      };
    }
    case fromDashboardsActions.ADD_WORKBOOK_FAVORITE: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);

      companyWorkbooksAsyncClone.obj.find((w: Workbook) => w.WorkbookId === action.payload.workbookId).IsFavorite = true;

      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone
      };
    }
    case fromDashboardsActions.REMOVE_WORKBOOK_FAVORITE: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);
      let tagFilterClone = cloneDeep(state.tagFilter);
      const workbook: Workbook = companyWorkbooksAsyncClone.obj.find((w: Workbook) => w.WorkbookId === action.payload.workbookId);
      workbook.IsFavorite = false;
      workbook.FavoritesOrder = null;
      if (state.dashboardView === DashboardView.Favorites) {
        const workbookLength = DashboardsHelper.getCompanyWorkbooksByView(
          state.companyWorkbooksAsync.obj, state.dashboardView, state.tagFilter
        ).length;
        if (workbookLength === 1) {
          tagFilterClone = null;
        }
      }
      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone,
        tagFilter: tagFilterClone
      };
    }
    case fromDashboardsActions.TOGGLE_DASHBOARD_VIEW: {
      return {
        ...state,
        dashboardView: action.payload,
        tagFilter: null
      };
    }
    case fromDashboardsActions.SAVE_WORKBOOK_ORDER_SUCCESS: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);
      const typeOverride = action.payload.workbookOrderType;
      if (!typeOverride) {
        companyWorkbooksAsyncClone.obj = DashboardsHelper.applyWorkbookOrderByView(
          companyWorkbooksAsyncClone.obj, action.payload.workbookIds, state.dashboardView);
      }
      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone
      };
    }
    case fromDashboardsActions.GET_COMPANY_WORKBOOK_VIEWS: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);

      const workbook = companyWorkbooksAsyncClone.obj.find(w => w.WorkbookId === action.payload.workbookId);
      if (workbook) {
        workbook.Views = generateDefaultAsyncStateObj<View[]>([]);
        workbook.Views.loading = true;
      }

      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone,
      };
    }
    case fromDashboardsActions.GET_COMPANY_WORKBOOK_VIEWS_SUCCESS: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);

      const workbook = companyWorkbooksAsyncClone.obj.find(w => w.WorkbookId === action.payload.workbookId);
      if (workbook) {
        workbook.Views.loading = false;
        workbook.Views.obj = action.payload.views;
      }

      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone,
      };
    }
    case fromDashboardsActions.GET_COMPANY_WORKBOOK_VIEWS_ERROR: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);

      const workbook = companyWorkbooksAsyncClone.obj.find(w => w.WorkbookId === action.payload.workbookId);
      if (workbook) {
        workbook.Views.loading = false;
        workbook.Views.loadingError = true;
      }

      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone,
      };
    }
    case fromDashboardsActions.SAVE_WORKBOOK_TAG: {
      return {
        ...state,
        savingTag: true,
        savingTagError: false
      };
    }
    case fromDashboardsActions.SAVE_WORKBOOK_TAG_SUCCESS: {
      return {
        ...state,
        savingTag: false,
        tagFilter: null
      };
    }
    case fromDashboardsActions.SAVE_WORKBOOK_TAG_ERROR: {
      return {
        ...state,
        savingTagError: true,
        savingTag: false
      };
    }
    case fromDashboardsActions.SET_TAGGED_FILTER: {
      return {
        ...state,
        tagFilter: action.payload
      };
    }
    case fromDashboardsActions.SET_DASHBOARD_VIEW: {
      return {
        ...state,
        dashboardView: action.payload
      };
    }
    case fromDashboardsActions.OPEN_TAG_WORKBOOK_MODAL: {
      const workbook = state.companyWorkbooksAsync.obj.find(w => w.WorkbookId === action.payload.workbookId);
      return {
        ...state,
        tagWorkbookModalOpen: true,
        activeWorkbook: workbook
      };
    }
    case fromDashboardsActions.CLOSE_TAG_WORKBOOK_MODAL: {
      return {
        ...state,
        tagWorkbookModalOpen: false,
        activeWorkbook: null
      };
    }
    case fromDashboardsActions.GET_ALL_COMPANY_WORKBOOK_VIEWS: {
      const allViewsAsyncClone = cloneDeep(state.allViewsLoadedAsync);
      allViewsAsyncClone.loading = true;
      return {
        ...state,
        allViewsLoadedAsync: allViewsAsyncClone
      };
    }
    case fromDashboardsActions.GET_ALL_COMPANY_WORKBOOK_VIEWS_ERROR: {
      const allViewsAsyncClone = cloneDeep(state.allViewsLoadedAsync);
      allViewsAsyncClone.loading = false;
      allViewsAsyncClone.loadingError = true;
      return {
        ...state,
        allViewsLoadedAsync: allViewsAsyncClone
      };
    }
    case fromDashboardsActions.GET_ALL_COMPANY_WORKBOOK_VIEWS_SUCCESS: {
      const allViewsAsyncClone = cloneDeep(state.allViewsLoadedAsync);
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);
      allViewsAsyncClone.loading = false;
      allViewsAsyncClone.loadingError = false;
      allViewsAsyncClone.obj = true;
      companyWorkbooksAsyncClone.obj.forEach(w => {
        w.Views = generateDefaultAsyncStateObj<View[]>([]);
        w.Views.obj = action.payload.filter(v => v.WorkbookId === w.WorkbookId);
      });
      return {
        ...state,
        allViewsLoadedAsync: allViewsAsyncClone,
        companyWorkbooksAsync: companyWorkbooksAsyncClone
      };
    }
    case fromDashboardsActions.SET_ALL_VIEWS_LOADED: {
      const allViewsAsyncClone = cloneDeep(state.allViewsLoadedAsync);
      allViewsAsyncClone.loading = false;
      allViewsAsyncClone.loadingError = false;
      allViewsAsyncClone.obj = action.payload;
      return {
        ...state,
        allViewsLoadedAsync: allViewsAsyncClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompanyWorkbooksAsync = (state: State) => state.companyWorkbooksAsync;
export const getSavingTag = (state: State) => state.savingTag;
export const getSavingTagError = (state: State) => state.savingTagError;
export const getDashboardView = (state: State) => state.dashboardView;
export const getFilteredCompanyWorkbooks = (state: State) => {
  const workbooks = DashboardsHelper.getCompanyWorkbooksByView(state.companyWorkbooksAsync.obj, state.dashboardView, state.tagFilter);
  return workbooks;
};

export const getDistinctTagsByView  = (state: State) => {
  const workbooks = DashboardsHelper.getCompanyWorkbooksByView(state.companyWorkbooksAsync.obj, state.dashboardView);
  const sortedTags = Array.from(new Set(workbooks.filter(cw => !!cw.Tag || cw.DefaultTag).map(cw => cw.Tag || cw.DefaultTag)))
    .sort(function( a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
  return sortedTags;
};

export const getDistinctTags = (state: State) => {
  return Array.from(new Set(state.companyWorkbooksAsync.obj.filter(cw => !!cw.Tag).map(cw => cw.Tag)))
    .sort(function( a, b) {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
};
export const getTagFilter = (state: State) => state.tagFilter;
export const getTagWorkbookModalOpen = (state: State) => state.tagWorkbookModalOpen;
export const getActiveWorkbook = (state: State) => state.activeWorkbook;
export const getAllViewsLoadedAsync = (state: State) => state.allViewsLoadedAsync;
