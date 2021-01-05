import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromReportsViewActions from '../actions/report-view.actions';

export interface State {
  workbookViewUrl: AsyncStateObj<string>;
}

const initialState: State = {
  workbookViewUrl: generateDefaultAsyncStateObj<string>(null)
};

export function reducer(state = initialState, action: fromReportsViewActions.Actions): State {
  switch (action.type) {
    case fromReportsViewActions.GET_COMPANY_REPORT_VIEW_URL:
    case fromReportsViewActions.GET_COMPANY_REPORT_SHEET_VIEW_URL:
    case fromReportsViewActions.GET_STANDARD_REPORT_SHEET_VIEW_URL:
    case fromReportsViewActions.GET_PEER_STANDARD_REPORT_VIEW_URL:
    case fromReportsViewActions.GET_STANDARD_REPORT_VIEW_URL: {
      const workbookViewUrlAsyncClone = cloneDeep(state.workbookViewUrl);

      workbookViewUrlAsyncClone.loading = true;
      workbookViewUrlAsyncClone.obj = null;
      workbookViewUrlAsyncClone.loadingError = false;

      return {
        ...state,
        workbookViewUrl: workbookViewUrlAsyncClone
      };
    }
    case fromReportsViewActions.GET_VIEW_URL_SUCCESS: {
      const workbookViewUrlAsyncClone = cloneDeep(state.workbookViewUrl);

      workbookViewUrlAsyncClone.loading = false;
      workbookViewUrlAsyncClone.obj = action.payload;

      return {
        ...state,
        workbookViewUrl: workbookViewUrlAsyncClone
      };
    }
    case fromReportsViewActions.GET_VIEW_URL_ERROR: {
      const workbookViewUrlAsyncClone = cloneDeep(state.workbookViewUrl);

      workbookViewUrlAsyncClone.loading = false;
      workbookViewUrlAsyncClone.loadingError = true;

      return {
        ...state,
        workbookViewUrl: workbookViewUrlAsyncClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getWorkbookViewUrlAsync = (state: State) => state.workbookViewUrl;
