import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromViewsActions from '../actions/views.actions';
import { View, Workbook } from '../models';

export interface State {
  companyWorkbooksAsync: AsyncStateObj<Workbook[]>;
}

const initialState: State = {
  companyWorkbooksAsync: generateDefaultAsyncStateObj<Workbook[]>([])
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
      companyWorkbooksAsyncClone.obj = action.payload;

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
        workbook.Views.obj.find((v: View) => v.ViewId === action.payload.viewId).IsFavorite = false;
      }
      return {
        ...state,
        companyWorkbooksAsync: companyWorkbooksAsyncClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompanyWorkbooksAsyncFromViews = (state: State) => state.companyWorkbooksAsync;
