import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromDashboardsActions from '../actions/dashboards.actions';
import { DashboardView, Workbook } from '../models';

export interface State {
  companyWorkbooksAsync: AsyncStateObj<Workbook[]>;
  dashboardView: DashboardView;
}

const initialState: State = {
  companyWorkbooksAsync: generateDefaultAsyncStateObj<Workbook[]>([]),
  dashboardView: DashboardView.All
};

export function reducer(state = initialState, action: fromDashboardsActions.Actions): State {
  switch (action.type) {
    case fromDashboardsActions.GET_COMPANY_WORKBOOKS: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);

      companyWorkbooksAsyncClone.loading = true;
      companyWorkbooksAsyncClone.obj = [];
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

      companyWorkbooksAsyncClone.obj.find((w: Workbook) => w.WorkbookId === action.payload.workbookId).IsFavorite = false;

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
    default: {
      return state;
    }
  }
}

function getWorkbookFilterFn(view: DashboardView) {
  let filterFn;
  switch (view) {
    case DashboardView.All:
      filterFn = () => true;
      break;
    case DashboardView.Favorites:
      filterFn = (workbook: Workbook) => workbook.IsFavorite === true;
      break;
    default:
      filterFn = () => true;
      break;
  }

  return filterFn;
}

export const getCompanyWorkbooksAsync = (state: State) => state.companyWorkbooksAsync;
export const getDashboardView = (state: State) => state.dashboardView;
export const getFilteredCompanyWorkbooks = (state: State) => {
  return state.companyWorkbooksAsync.obj.filter(getWorkbookFilterFn(state.dashboardView));
};
