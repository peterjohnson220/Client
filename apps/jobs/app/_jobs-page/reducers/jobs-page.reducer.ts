import * as cloneDeep from 'lodash.clonedeep';
import { arraySortByString, SortDirection } from 'libs/core/functions';
import * as fromJobsPageActions from '../actions';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';


export interface State {
  company: string;
  jobsPageId: string;
  loadingCompany: AsyncStateObj<boolean>;
  showAddToProjectModal: boolean;
  addingToProject: AsyncStateObj<boolean>;
  showJobStatusModal: boolean;
  changingJobStatus: AsyncStateObj<boolean>;
  pricingIdToBeDeleted: number;
  companyPayMarkets: any;
  structureGradeNames: any;
}

export const initialState: State = {
  company: '',
  jobsPageId: '',
  loadingCompany: generateDefaultAsyncStateObj<boolean>(false),
  showAddToProjectModal: false,
  addingToProject: generateDefaultAsyncStateObj<boolean>(false),
  showJobStatusModal: false,
  changingJobStatus: generateDefaultAsyncStateObj<boolean>(false),
  pricingIdToBeDeleted: undefined,
  companyPayMarkets: [],
  structureGradeNames: []
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
      return AsyncStateObjHelper.loading(state, 'loadingCompany');
    }
    case fromJobsPageActions.LOAD_COMPANY_SUCCESS: {
      const loadingCompanyClone = cloneDeep(state.loadingCompany);
      loadingCompanyClone.loadingError = false;

      return {
        ...state,
        loadingCompany: loadingCompanyClone,
        company: action.payload
      };
    }
    case fromJobsPageActions.LOAD_COMPANY_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'loadingCompany');
    }
    case fromJobsPageActions.SHOW_ADD_TO_PROJECT_MODAL: {
      const addingToProjectClone = cloneDeep(state.addingToProject);
      addingToProjectClone.loadingError = false;

      return {
        ...state,
        showAddToProjectModal: action.payload,
        addingToProject: addingToProjectClone
      };
    }
    case fromJobsPageActions.ADDING_TO_PROJECT: {
      return AsyncStateObjHelper.loading(state, 'addingToProject');
    }
    case fromJobsPageActions.ADDING_TO_PROJECT_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'addingToProject');
    }
    case fromJobsPageActions.ADDING_TO_PROJECT_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'addingToProject');
    }
    case fromJobsPageActions.SHOW_JOB_STATUS_MODAL: {
      const changingJobStatusClone = cloneDeep(state.changingJobStatus);
      changingJobStatusClone.loadingError = false;

      return {
        ...state,
        showJobStatusModal: action.payload,
        changingJobStatus: changingJobStatusClone
      };
    }
    case fromJobsPageActions.CHANGING_JOB_STATUS: {
      return AsyncStateObjHelper.loading(state, 'changingJobStatus');
    }
    case fromJobsPageActions.CHANGING_JOB_STATUS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'changingJobStatus');
    }
    case fromJobsPageActions.CHANGING_JOB_STATUS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'changingJobStatus');
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
        companyPayMarkets: action.payload.map(o => ({ Id: o.PayMarket, Value: o.PayMarket }))
          .sort((a, b) => arraySortByString(a.Id, b.Id, SortDirection.Ascending))
      };
    }
    case fromJobsPageActions.LOAD_STRUCTURE_GRADES_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'structureGradeNames',
        action.payload.map(o => ({ Id: o, Value: o }))
          .sort((a, b) => arraySortByString(a.Id, b.Id, SortDirection.Ascending)));
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
export const getShowAddToProjectModal = (state: State) => state.showAddToProjectModal;
export const getAddingToProject = (state: State) => state.addingToProject;
export const getShowJobStatusModal = (state: State) => state.showJobStatusModal;
export const getChangingJobStatus = (state: State) => state.changingJobStatus;
export const getPricingIdToBeDeleted = (state: State) => state.pricingIdToBeDeleted;
export const getCompanyPayMarkets = (state: State) => state.companyPayMarkets;
export const getStructureGradeNames = (state: State) => state.structureGradeNames;
