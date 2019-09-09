import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromViewsActions from '../actions/views.actions';
import { DashboardView, View, Workbook } from '../models';
import { ViewsHelper } from '../helpers';
import { ReportOrderType } from 'libs/constants';

export interface State {
  companyWorkbooksAsync: AsyncStateObj<Workbook[]>;
  dashboardView: DashboardView;
}

const initialState: State = {
  companyWorkbooksAsync: generateDefaultAsyncStateObj<Workbook[]>([]),
  dashboardView: DashboardView.Views
};

export function reducer(state = initialState, action: fromViewsActions.Actions): State {
  switch (action.type) {
    case fromViewsActions.GET_ALL_COMPANY_REPORTS_VIEWS: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);

      companyWorkbooksAsyncClone.loading = true;
      companyWorkbooksAsyncClone.loadingError = false;

      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone,
      };
    }
    case fromViewsActions.GET_ALL_COMPANY_REPORTS_VIEWS_SUCCESS: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);

      companyWorkbooksAsyncClone.loading = false;
      companyWorkbooksAsyncClone.obj = ViewsHelper.orderWorkbooksViews(action.payload);

      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone
      };
    }
    case fromViewsActions.GET_ALL_COMPANY_REPORTS_VIEWS_ERROR: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);
      companyWorkbooksAsyncClone.loadingError = true;

      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone
      };
    }
    case fromViewsActions.ADD_VIEW_FAVORITE: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);

      const workbook: Workbook = companyWorkbooksAsyncClone.obj.find((w: Workbook) => w.WorkbookId === action.payload.workbookId);
      if (!!workbook) {
        workbook.Views.obj.find((v: View) => v.ViewId === action.payload.viewId).IsFavorite = true;
      }

      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone
      };
    }
    case fromViewsActions.REMOVE_VIEW_FAVORITE: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);
      const workbook: Workbook = companyWorkbooksAsyncClone.obj.find((w: Workbook) => w.WorkbookId === action.payload.workbookId);
      if (!!workbook) {
        const view = workbook.Views.obj.find((v: View) => v.ViewId === action.payload.viewId);
        view.IsFavorite = false;
        view.FavoritesOrder = null;
      }
      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone
      };
    }
    case fromViewsActions.SAVE_REPORT_ORDER_SUCCESS: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);
      const workbook: Workbook = companyWorkbooksAsyncClone.obj.find((w: Workbook) => w.WorkbookId === action.payload.WorkbookId);
      workbook.Views.obj = ViewsHelper.applyViewOrderByType(
        workbook.Views.obj, action.payload.ViewIds, action.payload.Type);
      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone
      };
    }
    case fromViewsActions.GET_DASHBOARD_VIEW_SUCCESS: {
      let dashboardViewClone = cloneDeep(state.dashboardView);
      if (action.payload && typeof action.payload === 'string') {
        dashboardViewClone = action.payload;
      }
      return {
        ...state,
        dashboardView: dashboardViewClone
      };
    }
    case fromViewsActions.TOGGLE_DASHBOARD_VIEW: {
      return {
        ...state,
        dashboardView: action.payload.view
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompanyWorkbooksAsyncFromViews = (state: State) => state.companyWorkbooksAsync;
export const getFavoriteViews = (state: State) => {
  let favoriteViews = ViewsHelper.getFavoriteViews(state.companyWorkbooksAsync.obj);
  favoriteViews = ViewsHelper.getOrderByFn(ReportOrderType.Favorites, favoriteViews);

  return favoriteViews;
};
export const getDashboardViewThumbnailEnabled = (state: State) => state.dashboardView;
