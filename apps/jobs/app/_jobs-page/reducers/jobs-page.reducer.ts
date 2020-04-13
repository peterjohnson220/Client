import * as cloneDeep from 'lodash.clonedeep';
import { arraySortByString, SortDirection } from 'libs/core/functions';
import * as fromJobsPageActions from '../actions';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';


export interface State {
  jobsPageId: string;
  showCreateProjectModal: boolean;
  creatingToProject: AsyncStateObj<boolean>;
  showJobStatusModal: boolean;
  changingJobStatus: AsyncStateObj<boolean>;
  showDeleteJobModal: boolean;
  deletingJob: AsyncStateObj<boolean>;
  pricingIdToBeDeleted: number;
  companyPayMarkets: any;
  structureGradeNames: any;
  pricingDetailsView: string;
  exportOptions: any;
  navigatingToOldPage: AsyncStateObj<boolean>;

}

export const initialState: State = {
  jobsPageId: '',
  showCreateProjectModal: false,
  creatingToProject: generateDefaultAsyncStateObj<boolean>(false),
  showJobStatusModal: false,
  changingJobStatus: generateDefaultAsyncStateObj<boolean>(false),
  showDeleteJobModal: false,
  deletingJob: generateDefaultAsyncStateObj<boolean>(false),
  pricingIdToBeDeleted: undefined,
  companyPayMarkets: [],
  structureGradeNames: [],
  pricingDetailsView: 'Priced',
  exportOptions: [{
    Display: 'Download Pricings',
    Name: 'DownloadPricings',
    Description: 'High Level Pricing Details including Pay Markets, Effective Dates',
    Endpoint: 'ExportPricings',
    ValidExtensions: ['xlsx'],
    Custom: false,
    Exporting: generateDefaultAsyncStateObj<boolean>(false),
    ExportedReportExtension: undefined
  }, {
    Display: 'Download Job Report',
    Name: 'DownloadJobReport',
    Description: 'Report including Pricing Details and a breakdown of Pay',
    Endpoint: 'ExportJobReport',
    ValidExtensions: ['xlsx', 'pdf'],
    Custom: false,
    Exporting: generateDefaultAsyncStateObj<boolean>(false),
    ExportedReportExtension: undefined
  }],
  navigatingToOldPage: generateDefaultAsyncStateObj<boolean>(false),
};

export function reducer(state = initialState, action: fromJobsPageActions.JobsPageActions): State {
  switch (action.type) {
    case fromJobsPageActions.SET_JOBS_PAGE_ID: {
      return {
        ...state,
        jobsPageId: action.payload,
      };
    }
    case fromJobsPageActions.SHOW_CREATE_PROJECT_MODAL: {
      const creatingToProjectClone = cloneDeep(state.creatingToProject);
      creatingToProjectClone.loadingError = false;
      creatingToProjectClone.loadingErrorResponse = null;

      return {
        ...state,
        showCreateProjectModal: action.payload,
        creatingToProject: creatingToProjectClone
      };
    }
    case fromJobsPageActions.CREATING_PROJECT: {
      return AsyncStateObjHelper.loading(state, 'creatingToProject');
    }
    case fromJobsPageActions.CREATING_PROJECT_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'creatingToProject');
    }
    case fromJobsPageActions.CREATING_PROJECT_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'creatingToProject', action.error);
    }
    case fromJobsPageActions.SHOW_JOB_STATUS_MODAL: {
      const changingJobStatusClone = cloneDeep(state.changingJobStatus);
      changingJobStatusClone.loadingError = false;
      changingJobStatusClone.loadingErrorResponse = null;

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
      return AsyncStateObjHelper.loadingError(state, 'changingJobStatus', action.error);
    }
    case fromJobsPageActions.SHOW_DELETE_JOB_MODAL: {
      const deletingJobClone = cloneDeep(state.deletingJob);
      deletingJobClone.loadingError = false;
      deletingJobClone.loadingErrorResponse = null;

      return {
        ...state,
        showDeleteJobModal: action.payload,
        deletingJob: deletingJobClone
      };
    }
    case fromJobsPageActions.DELETING_JOB: {
      return AsyncStateObjHelper.loading(state, 'deletingJob');
    }
    case fromJobsPageActions.DELETING_JOB_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'deletingJob');
    }
    case fromJobsPageActions.DELETING_JOB_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'deletingJob', action.error);
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
    case fromJobsPageActions.CHANGE_PRICING_DETAILS_VIEW: {
      return {
        ...state,
        pricingDetailsView: action.payload
      };
    }
    case fromJobsPageActions.LOAD_CUSTOM_EXPORTS_SUCCESS: {
      if (action.payload.DisplayText) {
        const exportObj = {
          Display: action.payload.DisplayText,
          Name: action.payload.ExportName,
          Description: 'Company custom export report',
          Endpoint: 'ExportCustomJobReport',
          ValidExtensions: ['xlsx'],
          Custom: true,
          Exporting: generateDefaultAsyncStateObj<boolean>(false),
          ExportedReportExtension: undefined
        };
        const options = cloneDeep(state.exportOptions);
        options.push(exportObj);
        return {
          ...state,
          exportOptions: options
        };
      }
      return state;
    }
    case fromJobsPageActions.EXPORT_PRICINGS: {
      const updatedExportOptions = cloneDeep(state.exportOptions);
      const exportedReport = updatedExportOptions.find(eo => eo.Name === action.payload.Name);

      exportedReport.ExportedReportExtension = action.payload.FileExtension;
      exportedReport.Exporting = AsyncStateObjHelper.loading(exportedReport, 'Exporting').Exporting;

      return {
        ...state,
        exportOptions: updatedExportOptions
      };
    }
    case fromJobsPageActions.EXPORT_PRICINGS_SUCCESS: {
      const updatedExportOptions = cloneDeep(state.exportOptions);
      const exportedReport = updatedExportOptions.find(eo => eo.Name === action.payload.Name);
      exportedReport.ExportedReportExtension = action.payload.FileExtension;
      exportedReport.Exporting = AsyncStateObjHelper.loadingSuccess(exportedReport, 'Exporting').Exporting;

      return {
        ...state,
        exportOptions: updatedExportOptions
      };
    }
    case fromJobsPageActions.EXPORT_PRICINGS_ERROR: {
      const updatedExportOptions = cloneDeep(state.exportOptions);
      const exportedReport = updatedExportOptions.find(eo => eo.Name === action.payload.Name);
      exportedReport.ExportedReportExtension = action.payload.FileExtension;
      exportedReport.Exporting = AsyncStateObjHelper.loadingError(exportedReport, 'Exporting').Exporting;

      return {
        ...state,
        exportOptions: updatedExportOptions
      };
    }
    case fromJobsPageActions.TOGGLE_JOBS_PAGE: {
      return AsyncStateObjHelper.loading(state, 'navigatingToOldPage');
    }
    case fromJobsPageActions.TOGGLE_JOBS_PAGE_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'navigatingToOldPage');
    }
    case fromJobsPageActions.TOGGLE_JOBS_PAGE_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'navigatingToOldPage');
    }
    default: {
      return state;
    }
  }
}

export const getJobsPageId = (state: State) => state.jobsPageId;
export const getShowCreateProjectModal = (state: State) => state.showCreateProjectModal;
export const getCreatingToProject = (state: State) => state.creatingToProject;
export const getShowJobStatusModal = (state: State) => state.showJobStatusModal;
export const getChangingJobStatus = (state: State) => state.changingJobStatus;
export const getShowDeleteJobModal = (state: State) => state.showDeleteJobModal;
export const getDeletingJob = (state: State) => state.deletingJob;
export const getPricingIdToBeDeleted = (state: State) => state.pricingIdToBeDeleted;
export const getCompanyPayMarkets = (state: State) => state.companyPayMarkets;
export const getStructureGradeNames = (state: State) => state.structureGradeNames;
export const getPricingDetailsView = (state: State) => state.pricingDetailsView;
export const getExportOptions = (state: State) => state.exportOptions;
export const getNavigatingToOldPage = (state: State) => state.navigatingToOldPage;

