import { ValidationResultItem, ValidationResultItemTypeEnum } from 'libs/models';

import * as fromImportExchangeJobsActions from '../actions/import-exchange-jobs.actions';

export interface State {
  uploadingFile: boolean;
  uploadingFileError: boolean;
  storedDataFile: string;
  validationResults: ValidationResultItem[];
  importingJobs: boolean;
  isFileValid: boolean;
  importExchangeJobsModalOpen: boolean;
}

const initialState: State = {
  uploadingFile: false,
  uploadingFileError: false,
  storedDataFile: null,
  validationResults: [],
  importingJobs: false,
  isFileValid: false,
  importExchangeJobsModalOpen: false
};

export function reducer(
  state = initialState,
  action: fromImportExchangeJobsActions.Actions
): State {
  switch (action.type) {
    case fromImportExchangeJobsActions.UPLOADING_FILE: {
      return {
        ...state,
        uploadingFile: true,
        storedDataFile: null,
        validationResults: [],
        importingJobs: false,
        isFileValid: false
      };
    }
    case fromImportExchangeJobsActions.UPLOADING_FILE_SUCCESS: {
      const validationErrors = action.payload.ValidationResults.filter(vr => vr.Type === ValidationResultItemTypeEnum.Error);
      const fileValid = validationErrors && validationErrors.length === 0 && action.payload.StoredDataFile != null;
      return {
        ...state,
        uploadingFile: false,
        uploadingFileError: false,
        storedDataFile: action.payload.StoredDataFile,
        validationResults: action.payload.ValidationResults,
        importingJobs: false,
        isFileValid: fileValid
      };
    }
    case fromImportExchangeJobsActions.UPLOADING_FILE_ERROR: {
      return {
        ...state,
        uploadingFile: false,
        uploadingFileError: true,
        storedDataFile: null,
        validationResults: [],
        importingJobs: false,
        isFileValid: false,
      };
    }
    case fromImportExchangeJobsActions.FILE_CLEARED: {
      return {
        ...state,
        uploadingFile: false,
        uploadingFileError: false,
        storedDataFile: null,
        validationResults: [],
        importingJobs: false,
        isFileValid: false
      };
    }
    case fromImportExchangeJobsActions.IMPORTING_EXCHANGE_JOBS: {
      return {
        ...state,
        uploadingFile: false,
        uploadingFileError: false,
        storedDataFile: null,
        validationResults: [],
        importingJobs: true,
        isFileValid: true
      };
    }
    case fromImportExchangeJobsActions.IMPORTING_EXCHANGE_JOBS_SUCCESS: {
      return {
        ...state,
        uploadingFile: false,
        uploadingFileError: false,
        storedDataFile: null,
        validationResults: [],
        importingJobs: false,
        isFileValid: false
      };
    }
    case fromImportExchangeJobsActions.IMPORTING_EXCHANGE_JOBS_ERROR: {
      return {
        ...state,
        uploadingFile: false,
        uploadingFileError: false,
        importingJobs: false
      };
    }
    case fromImportExchangeJobsActions.OPENING_IMPORT_EXCHANGE_JOBS_MODAL: {
      return {
        ...state,
        importExchangeJobsModalOpen: true
      };
    }
    case fromImportExchangeJobsActions.CLOSING_IMPORT_EXCHANGE_JOBS_MODAL: {
      return {
        ...state,
        importExchangeJobsModalOpen: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getUploadingFile = (state: State) => state.uploadingFile;
export const getUploadingFileError = (state: State) => state.uploadingFileError;
export const getStoredDataFile = (state: State) => state.storedDataFile;
export const getValidationResults = (state: State) => state.validationResults;
export const getImportingJobs = (state: State) => state.importingJobs;
export const getIsFileValid = (state: State) => state.isFileValid;
export const getImportExchangeJobsModalOpen = (state: State) => state.importExchangeJobsModalOpen;
