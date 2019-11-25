import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromViewsActions from '../actions/views.actions';
import { DashboardView, View, Workbook } from '../models';
import { ViewsHelper } from '../helpers';
import { ReportOrderType } from 'libs/constants';

export interface State {
  companyWorkbooksAsync: AsyncStateObj<Workbook[]>;
  tableauReportWorkbooks: Workbook[];
  dataViewReports: Workbook[];
  dashboardView: DashboardView;
}

const initialState: State = {
  companyWorkbooksAsync: generateDefaultAsyncStateObj<Workbook[]>([]),
  tableauReportWorkbooks: [],
  dataViewReports: [],
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
      let tableauReportWorkbooksClone = cloneDeep(state.tableauReportWorkbooks);
      let dataViewReportsClone = cloneDeep(state.dataViewReports);

      companyWorkbooksAsyncClone.loading = false;
      companyWorkbooksAsyncClone.obj = action.payload;
      tableauReportWorkbooksClone = action.payload.filter(tr => tr.Type === 'TableauReport');
      tableauReportWorkbooksClone = ViewsHelper.orderWorkbooksViews(tableauReportWorkbooksClone);
      dataViewReportsClone = action.payload.filter(dw => dw.Type === 'DataView');
      dataViewReportsClone = ViewsHelper.orderDataViewReports(dataViewReportsClone);

      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone,
        tableauReportWorkbooks: tableauReportWorkbooksClone,
        dataViewReports: dataViewReportsClone
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
      const tableauReportWorkbooksClone = cloneDeep(state.tableauReportWorkbooks);

      const workbook: Workbook = tableauReportWorkbooksClone.find((w: Workbook) => w.WorkbookId === action.payload.workbookId);
      if (!!workbook) {
        workbook.Views.obj.find((v: View) => v.ViewId === action.payload.viewId).IsFavorite = true;
      }

      return {
        ...state,
        tableauReportWorkbooks: tableauReportWorkbooksClone
      };
    }
    case fromViewsActions.REMOVE_VIEW_FAVORITE: {
      const tableauReportWorkbooksClone = cloneDeep(state.tableauReportWorkbooks);
      const workbook: Workbook = tableauReportWorkbooksClone.find((w: Workbook) => w.WorkbookId === action.payload.workbookId);
      if (!!workbook) {
        const view = workbook.Views.obj.find((v: View) => v.ViewId === action.payload.viewId);
        view.IsFavorite = false;
        view.FavoritesOrder = null;
      }
      return {
        ...state,
        tableauReportWorkbooks: tableauReportWorkbooksClone
      };
    }
    case fromViewsActions.ADD_DATA_VIEW_REPORT_FAVORITE: {
      const dataViewReportsClone = cloneDeep(state.dataViewReports);

      const workbook: Workbook = dataViewReportsClone.find((w: Workbook) => w.WorkbookId === action.payload.workbookId);
      if (!!workbook) {
        workbook.IsFavorite = true;
      }

      return {
        ...state,
        dataViewReports: dataViewReportsClone
      };
    }
    case fromViewsActions.REMOVE_DATA_VIEW_REPORT_FAVORITE: {
      const dataViewReportsClone = cloneDeep(state.dataViewReports);
      const workbook: Workbook = dataViewReportsClone.find((w: Workbook) => w.WorkbookId === action.payload.workbookId);
      if (!!workbook) {
        workbook.IsFavorite = false;
      }
      return {
        ...state,
        dataViewReports: dataViewReportsClone
      };
    }
    case fromViewsActions.SAVE_REPORT_ORDER_SUCCESS: {
      const tableauReportWorkbooksClone = cloneDeep(state.tableauReportWorkbooks);
      const workbook: Workbook = tableauReportWorkbooksClone.find((w: Workbook) => w.WorkbookId === action.payload.WorkbookId);
      workbook.Views.obj = ViewsHelper.applyViewOrderByType(
        workbook.Views.obj, action.payload.ViewIds, action.payload.Type);
      return {
        ...state,
        tableauReportWorkbooks: tableauReportWorkbooksClone
      };
    }
    case fromViewsActions.SET_DASHBOARD_VIEW: {
      return {
        ...state,
        dashboardView: action.payload
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
export const getTableauReportsFromViews = (state: State) => state.tableauReportWorkbooks;
export const getDataViewReportsFromViews = (state: State) => state.dataViewReports;
export const getFavoriteViews = (state: State) => {
  let favoriteTableauReports = ViewsHelper.getFavoriteTableauReports(state.tableauReportWorkbooks);
  favoriteTableauReports = ViewsHelper.getOrderByFn(ReportOrderType.Favorites, favoriteTableauReports);

  return favoriteTableauReports;
};
export const getFavoriteDataViewReports = (state: State) => {
  return ViewsHelper.getFavoriteDataViewReports(state.dataViewReports.filter(wb => wb.IsFavorite === true));
} ;
export const getDashboardViewThumbnailEnabled = (state: State) => state.dashboardView;
