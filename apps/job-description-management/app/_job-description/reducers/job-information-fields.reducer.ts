import cloneDeep from 'lodash/cloneDeep';

import * as fromJobInformationFieldsActions from '../actions/job-information-fields.actions';
import { AvailableJobInformationField } from 'libs/features/job-description-management/models';

export interface State {
  jobInformationFieldsForBulkExport: AvailableJobInformationField[];
  loadingJobInformationFieldsForBulkExport: boolean;
  loadingJobInformationFieldsForBulkExportError: boolean;
}

export const initialState: State = {
  jobInformationFieldsForBulkExport: [],
  loadingJobInformationFieldsForBulkExport: false,
  loadingJobInformationFieldsForBulkExportError: false
};

export function reducer(state = initialState, action: fromJobInformationFieldsActions.Actions): State {
  switch (action.type) {
    case fromJobInformationFieldsActions.LOAD_JOB_INFORMATION_FIELDS_FOR_BULK_EXPORT:
      return {
        ...state,
        loadingJobInformationFieldsForBulkExport: true
      };
    case fromJobInformationFieldsActions.LOAD_JOB_INFORMATION_FIELDS_FOR_BULK_EXPORT_ERROR:
      return {
        ...state,
        loadingJobInformationFieldsForBulkExport: false,
        loadingJobInformationFieldsForBulkExportError: true
      };
    case fromJobInformationFieldsActions.LOAD_JOB_INFORMATION_FIELDS_FOR_BULK_EXPORT_SUCCESS:
      const newJifs = cloneDeep(action.payload);
      for (let i = 0; i < newJifs.length; i++) {
        newJifs[i].Checked = newJifs[i].IsDefault;
      }

      return {
        ...state,
        loadingJobInformationFieldsForBulkExport: false,
        jobInformationFieldsForBulkExport: newJifs
      };
    default:
      return state;
  }
}

export const getJobInformationFieldsForBulkExportLoading = (state: State) => state.loadingJobInformationFieldsForBulkExport;
export const getJobInformationFieldsForBulkExportLoadingError = (state: State) => state.loadingJobInformationFieldsForBulkExportError;
export const getJobInformationFieldsForBulkExport = (state: State) => state.jobInformationFieldsForBulkExport;
