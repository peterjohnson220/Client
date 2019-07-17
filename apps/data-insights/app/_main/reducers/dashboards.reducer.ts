import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromDashboardsActions from '../actions/dashboards.actions';
import { DashboardView, View, Workbook } from '../models';
import { DashboardsHelper } from '../helpers';

export interface State {
  companyWorkbooksAsync: AsyncStateObj<Workbook[]>;
  savingTag: boolean;
  savingTagError: boolean;
  dashboardView: DashboardView;
}

const initialState: State = {
  companyWorkbooksAsync: generateDefaultAsyncStateObj<Workbook[]>([]),
  savingTag: false,
  savingTagError: false,
  dashboardView: DashboardView.All
};

export function reducer(state = initialState, action: fromDashboardsActions.Actions): State {
  switch (action.type) {
    case fromDashboardsActions.GET_COMPANY_WORKBOOKS: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);

      companyWorkbooksAsyncClone.loading = true;
      companyWorkbooksAsyncClone.loadingError = false;

      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone,
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
      let dashboardView = state.dashboardView;
      const workbook: Workbook = companyWorkbooksAsyncClone.obj.find((w: Workbook) => w.WorkbookId === action.payload.workbookId);
      workbook.IsFavorite = false;
      workbook.FavoritesOrder = null;

      if (!companyWorkbooksAsyncClone.obj.some(w => w.IsFavorite)) {
        dashboardView = DashboardView.All;
      }

      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone,
        dashboardView: dashboardView
      };
    }
    case fromDashboardsActions.TOGGLE_DASHBOARD_VIEW: {
      return {
        ...state,
        dashboardView: action.payload.view
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
        savingTag: false
      };
    }
    case fromDashboardsActions.SAVE_WORKBOOK_TAG_ERROR: {
      return {
        ...state,
        savingTagError: true,
        savingTag: false
      };
    }
    default: {
      return state;
    }
    case fromDashboardsActions.GET_DASHBOARD_VIEW_SUCCESS: {
      let dashboardViewClone = cloneDeep(state.dashboardView);
      if (action.payload && typeof action.payload === 'string') {
        dashboardViewClone = action.payload;
      }
      return {
        ...state,
        dashboardView: dashboardViewClone
      };
    }
  }
}

export const getCompanyWorkbooksAsync = (state: State) => state.companyWorkbooksAsync;
export const getSavingTag = (state: State) => state.savingTag;
export const getSavingTagError = (state: State) => state.savingTagError;
export const getDashboardView = (state: State) => state.dashboardView;
export const getFilteredCompanyWorkbooks = (state: State) => {
  const workbooks = DashboardsHelper.getCompanyWorkbooksByView(state.companyWorkbooksAsync.obj, state.dashboardView);
  return workbooks;
};
export const getDistinctTags = (state: State) => {
  return Array.from(new Set(state.companyWorkbooksAsync.obj.filter(cw => !!cw.Tag).map(cw => cw.Tag)));
};
