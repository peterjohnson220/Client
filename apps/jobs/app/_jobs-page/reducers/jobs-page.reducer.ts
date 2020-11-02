import cloneDeep from 'lodash/cloneDeep';
import { arraySortByString, SortDirection } from 'libs/core/functions';
import * as fromJobsPageActions from '../actions';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';


export interface State {
  jobsPageId: string;
  creatingProject: AsyncStateObj<boolean>;
  changingJobStatus: AsyncStateObj<boolean>;
  deletingJob: AsyncStateObj<boolean>;
  companyPayMarkets: any;
  structureGradeNames: any;
  exportOptions: any;
  navigatingToOldPage: AsyncStateObj<boolean>;
}

export const initialState: State = {
  jobsPageId: '',
  creatingProject: generateDefaultAsyncStateObj<boolean>(false),
  changingJobStatus: generateDefaultAsyncStateObj<boolean>(false),
  deletingJob: generateDefaultAsyncStateObj<boolean>(false),
  companyPayMarkets: [],
  structureGradeNames: [],
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
  navigatingToOldPage: generateDefaultAsyncStateObj<boolean>(false)
};

export function reducer(state = initialState, action: fromJobsPageActions.JobsPageActions): State {
  switch (action.type) {
    case fromJobsPageActions.SET_JOBS_PAGE_ID: {
      return {
        ...state,
        jobsPageId: action.payload,
      };
    }
    case fromJobsPageActions.RESET_JOBS_PAGE_MODALS: {
      let curState = AsyncStateObjHelper.resetErrors(state, 'creatingProject');
      curState = AsyncStateObjHelper.resetErrors(curState, 'changingJobStatus');
      curState = AsyncStateObjHelper.resetErrors(curState, 'deletingJob');
      return curState;
    }
    case fromJobsPageActions.CREATING_PROJECT: {
      return AsyncStateObjHelper.saving(state, 'creatingProject');
    }
    case fromJobsPageActions.CREATING_PROJECT_SUCCESS: {
      return AsyncStateObjHelper.savingSuccess(state, 'creatingProject');
    }
    case fromJobsPageActions.CREATING_PROJECT_ERROR: {
      return AsyncStateObjHelper.savingError(state, 'creatingProject', action.error);
    }
    case fromJobsPageActions.CHANGING_JOB_STATUS: {
      return AsyncStateObjHelper.saving(state, 'changingJobStatus');
    }
    case fromJobsPageActions.CHANGING_JOB_STATUS_SUCCESS: {
      return AsyncStateObjHelper.savingSuccess(state, 'changingJobStatus');
    }
    case fromJobsPageActions.CHANGING_JOB_STATUS_ERROR: {
      return AsyncStateObjHelper.savingError(state, 'changingJobStatus', action.error);
    }
    case fromJobsPageActions.DELETING_JOB: {
      return AsyncStateObjHelper.saving(state, 'deletingJob');
    }
    case fromJobsPageActions.DELETING_JOB_SUCCESS: {
      return AsyncStateObjHelper.savingSuccess(state, 'deletingJob');
    }
    case fromJobsPageActions.DELETING_JOB_ERROR: {
      return AsyncStateObjHelper.savingError(state, 'deletingJob', action.error);
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
export const getCreatingProject = (state: State) => state.creatingProject;
export const getChangingJobStatus = (state: State) => state.changingJobStatus;
export const getDeletingJob = (state: State) => state.deletingJob;
export const getCompanyPayMarkets = (state: State) => state.companyPayMarkets;
export const getStructureGradeNames = (state: State) => state.structureGradeNames;
export const getExportOptions = (state: State) => state.exportOptions;
export const getNavigatingToOldPage = (state: State) => state.navigatingToOldPage;

