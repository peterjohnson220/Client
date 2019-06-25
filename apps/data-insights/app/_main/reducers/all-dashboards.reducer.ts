import * as fromAllDashboardsActions from '../actions/all-dashboards.action';
import { TableauReport } from '../models';

export interface State {
  loadingCompanyReports: boolean;
  loadingCompanyReportsSuccess: boolean;
  loadingCompanyReportsError: boolean;
  companyReports: TableauReport[];
}

const initialState: State = {
  loadingCompanyReports: false,
  loadingCompanyReportsSuccess: false,
  loadingCompanyReportsError: false,
  companyReports: []
};

export function reducer(state = initialState, action: fromAllDashboardsActions.Actions): State {
  switch (action.type) {
    case fromAllDashboardsActions.GET_COMPANY_REPORTS: {
      return {
        ...state,
        loadingCompanyReports: true,
        loadingCompanyReportsSuccess: false,
        loadingCompanyReportsError: false
      };
    }
    case fromAllDashboardsActions.GET_COMPANY_REPORTS_SUCCESS: {
      return {
        ...state,
        loadingCompanyReports: false,
        loadingCompanyReportsSuccess: true,
        companyReports: action.payload.tableauReports
      };
    }
    case fromAllDashboardsActions.GET_COMPANY_REPORTS_ERROR: {
      return {
        ...state,
        loadingCompanyReports: false,
        loadingCompanyReportsError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoadingCompanyReports = (state: State) => state.loadingCompanyReports;
export const getLoadingCompanyReportsSuccess = (state: State) => state.loadingCompanyReportsSuccess;
export const getLoadingCompanyReportsError = (state: State) => state.loadingCompanyReportsError;
export const getCompanyReports = (state: State) => state.companyReports;
