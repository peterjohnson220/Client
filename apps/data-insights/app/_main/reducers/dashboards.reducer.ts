import * as cloneDeep from 'lodash.clonedeep';
import { orderBy } from 'lodash';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromDashboardsActions from '../actions/dashboards.actions';
import { DashboardView, Workbook } from '../models';

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
    case fromDashboardsActions.SAVE_WORKBOOK_ORDER_SUCCESS: {
      const companyWorkbooksAsyncClone = cloneDeep(state.companyWorkbooksAsync);
      companyWorkbooksAsyncClone.obj = applyWorkbookOrderByView(companyWorkbooksAsyncClone.obj,
        action.payload.workbookIds, state.dashboardView);
      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone
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

function getOrderByFn(view: DashboardView, workbooks: Workbook[]) {
  let orderByFn;
  switch (view) {
    case DashboardView.All:
      orderByFn = orderBy(workbooks, ['DashboardsOrder', 'WorkbookName'], 'asc');
      break;
    case DashboardView.Favorites:
      orderByFn = orderBy(workbooks, ['FavoritesOrder', 'WorkbookName'], 'asc');
      break;
    default:
      orderByFn = orderBy(workbooks, ['WorkbookName'], 'asc');
      break;
  }

  return orderByFn;
}

function applyWorkbookOrderByView(workbooks: Workbook[], orderedWorkbookIds: string[], view: DashboardView): Workbook[] {
  orderedWorkbookIds.map((id: string, index: number) => {
    const workbook = workbooks.find((w: Workbook) => w.WorkbookId === id);
    if (view === DashboardView.All) {
      workbook.DashboardsOrder = index + 1;
    } else {
      workbook.FavoritesOrder = index + 1;
    }
  });
  return workbooks;
}

export const getCompanyWorkbooksAsync = (state: State) => state.companyWorkbooksAsync;
export const getSavingTag = (state: State) => state.savingTag;
export const getSavingTagError = (state: State) => state.savingTagError;
export const getDashboardView = (state: State) => state.dashboardView;
export const getFilteredCompanyWorkbooks = (state: State) => {
  let workbooks = state.companyWorkbooksAsync.obj.filter(getWorkbookFilterFn(state.dashboardView));
  workbooks = getOrderByFn(state.dashboardView, workbooks);
  return workbooks;
};
export const getDistinctTags = (state: State) => {
  return Array.from(new Set(state.companyWorkbooksAsync.obj.filter(cw => !!cw.Tag).map(cw => cw.Tag)));
};
