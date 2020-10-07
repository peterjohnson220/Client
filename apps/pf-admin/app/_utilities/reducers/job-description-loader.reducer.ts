import cloneDeep from 'lodash/cloneDeep';

import { Company } from 'libs/models/company/company.model';
import { ValidationResultItem } from 'libs/models/common';
import { ValidateStepResultItem } from 'libs/models/jdm/validation-step-result-item.model';

import * as fromJobDescriptionLoaderActions from '../actions/job-description-loader.actions';


export interface State {
  validated: boolean;
  validating: boolean;
  imported: boolean;
  importing: boolean;
  loading: boolean;
  deletingJobDescriptions: boolean;
  deletingJobDescriptionsError: boolean;
  company: Company;
  entity: ValidateStepResultItem;
  results: ValidationResultItem[];
}

const initialState: State = {
  validated: false,
  validating: false,
  imported: false,
  importing: false,
  loading: false,
  deletingJobDescriptions: false,
  deletingJobDescriptionsError: false,
  company: null,
  entity: null,
  results: []
};

export function reducer(state = initialState, action: fromJobDescriptionLoaderActions.Actions): State {
  switch (action.type) {
    case fromJobDescriptionLoaderActions.VALIDATE_JOB_DESCRIPTION_IMPORT:
      return {
        ...state,
        validating: true
      };
    case fromJobDescriptionLoaderActions.VALIDATE_JOB_DESCRIPTION_IMPORT_SUCCESS:
      return {
        ...state,
        validated: true,
        validating: false,
        entity: cloneDeep(action.payload)
      };
    case fromJobDescriptionLoaderActions.LOAD_JOB_DESCRIPTIONS:
      return {
        ...state,
        importing: true
      };
    case fromJobDescriptionLoaderActions.LOAD_JOB_DESCRIPTIONS_SUCCESS:
      return {
        ...state,
        imported: true,
        importing: false,
        results: cloneDeep(action.payload)
      };
    case fromJobDescriptionLoaderActions.RESET_LOAD_JOB_DESCRIPTIONS:
      return {
        ...state,
        imported: false,
        validated: false,
        entity: null,
        results: []
      };
    case fromJobDescriptionLoaderActions.LOAD_COMPANY:
      return {
        ...state,
        loading: true
      };
    case fromJobDescriptionLoaderActions.LOAD_COMPANY_SUCCESS:
      return {
        ...state,
        loading: false,
        company: cloneDeep(action.payload)
      };
    case fromJobDescriptionLoaderActions.DELETE_JOB_DESCRIPTIONS:
      return {
        ...state,
        deletingJobDescriptions: true,
        deletingJobDescriptionsError: false
      };
    case fromJobDescriptionLoaderActions.DELETE_JOB_DESCRIPTIONS_SUCCESS:
      return {
        ...state,
        deletingJobDescriptions: false
      };
    case fromJobDescriptionLoaderActions.DELETE_JOB_DESCRIPTIONS_ERROR:
      return {
        ...state,
        deletingJobDescriptions: false,
        deletingJobDescriptionsError: true
      };
    case fromJobDescriptionLoaderActions.CLEAR_DELETE_JOB_DESCRIPTIONS_ERROR:
      return {
        ...state,
        deletingJobDescriptionsError: false
      };
    default:
      return state;
  }
}

export const getValidated =  (state: State) => state.validated;
export const getValidating =  (state: State) => state.validating;
export const getValidationResults =  (state: State) => state.entity;
export const getImported =  (state: State) => state.imported;
export const getImporting =  (state: State) => state.importing;
export const getImportingResults =  (state: State) => state.results;
export const getJobDescriptionLoaderCompany =  (state: State) => state.company;
export const getDeletingJobDescriptions =  (state: State) => state.deletingJobDescriptions;
export const getDeletingJobDescriptionsError =  (state: State) => state.deletingJobDescriptionsError;


