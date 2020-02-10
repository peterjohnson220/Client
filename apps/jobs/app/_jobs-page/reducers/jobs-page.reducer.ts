import {arraySortByString, SortDirection} from 'libs/core/functions';
import * as fromJobsPageActions from '../actions';


export interface State {
  company: string;
  jobsPageId: string;
  loading: boolean;
  loadingError: boolean;
  addingToProject: boolean;
  showAddToProjectSummaryModal: boolean;
  pricingIdToBeDeleted: number;
  companyPayMarkets:any;
}

export const initialState: State = {
  company: '',
  loading: false,
  jobsPageId: '',
  loadingError: false,
  addingToProject : false,
  showAddToProjectSummaryModal: false,
  pricingIdToBeDeleted: undefined,
  companyPayMarkets: [],
};

export function reducer(state = initialState, action: fromJobsPageActions.JobsPageActions): State {
  switch (action.type) {
    case fromJobsPageActions.SET_JOBS_PAGE_ID: {
      return {
        ...state,
        jobsPageId: action.payload,
      };
    }
    case fromJobsPageActions.LOAD_COMPANY: {
      return {
        ...state,
        loading: true,
        loadingError: false,
      };
    }
    case fromJobsPageActions.LOAD_COMPANY_SUCCESS: {
      return {
        ...state,
        company: action.payload,
        loading: false,
        loadingError: false,
      };
    }
    case fromJobsPageActions.ADD_TO_PROJECT_SUMMARY: {
      return {
        ...state,
        showAddToProjectSummaryModal: true

      };
    }
    case fromJobsPageActions.CANCEL_ADD_TO_PROJECT_SUMMARY: {
      return {
        ...state,
        showAddToProjectSummaryModal: false
      };
    }
    case fromJobsPageActions.ADD_TO_PROJECT: {
      return {
        ...state,
        addingToProject: true
      };
    }
    case fromJobsPageActions.HANDLE_API_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromJobsPageActions.CONFIRM_DELETE_PRICING_FROM_GRID: {
      return {
        ...state,
        pricingIdToBeDeleted: action.payload.CompanyJobPricingId
      };
    }
    case fromJobsPageActions.LOAD_COMPANY_PAYMARKETS_SUCCESS: {
      return {
        ...state,
        companyPayMarkets: action.payload.map(o => ({Id: o.PayMarket, Value: o.PayMarket}))
          .sort((a, b) => arraySortByString(a.Id, b.Id, SortDirection.Ascending))
      };
    }
    case fromJobsPageActions.CANCEL_DELETE_PRICING:
    case fromJobsPageActions.DELETE_PRICING_SUCCESS: {
      return {
        ...state,
        pricingIdToBeDeleted: undefined
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompany = (state: State) => state.company;
export const getJobsPageId = (state: State) => state.jobsPageId;
export const getloading = (state: State) => state.loading;
export const getloadingError = (state: State) => state.loadingError;
export const getAddToProjectButtonState = (state: State) => state.addingToProject;
export const getPricingIdToBeDeleted = (state: State) => state.pricingIdToBeDeleted;
export const getCompanyPayMarkets = (state: State) => state.companyPayMarkets;
export const getShowAddToProjectSummaryModal = (state: State) => state.showAddToProjectSummaryModal;
