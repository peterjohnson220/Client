import * as cloneDeep from 'lodash.clonedeep';

import * as fromJobDescriptionAppliesToActions from '../../shared/actions/job-description-appliesto.actions';
import { JobDescriptionAppliesToItem } from '../models/job-description-appliesto-item.model';
import { AppliesToAttributesExist } from '../models/applies-to-attributes-exist.model';

export interface State {
  appliesToAttributesExist: AppliesToAttributesExist;
  gettingAppliesToAttributesExist: boolean;
  gettingAppliesToAttributesExistError: boolean;
  jobDescriptionAppliesToItems: JobDescriptionAppliesToItem[];
  jobDescriptionAppliesToValues: string[];
  loadingJobDescriptionAppliesTo: boolean;
  loadingJobDescriptionAppliesToError: boolean;
  loadingJobDescriptionAppliesToValues: boolean;
  loadingJobDescriptionAppliesToValuesError: boolean;
}

export const initialState: State = {
  appliesToAttributesExist: null,
  gettingAppliesToAttributesExist: false,
  gettingAppliesToAttributesExistError: false,
  jobDescriptionAppliesToItems: [],
  jobDescriptionAppliesToValues: [],
  loadingJobDescriptionAppliesTo: false,
  loadingJobDescriptionAppliesToError: false,
  loadingJobDescriptionAppliesToValues: false,
  loadingJobDescriptionAppliesToValuesError: false
};

export function reducer(state = initialState, action: fromJobDescriptionAppliesToActions.Actions): State {
  switch (action.type) {
    case fromJobDescriptionAppliesToActions.GET_APPLIES_TO_ATTRIBUTES_EXIST:
      return {
        ...state,
        gettingAppliesToAttributesExist: true
      };
    case fromJobDescriptionAppliesToActions.GET_APPLIES_TO_ATTRIBUTES_EXIST_ERROR:
      return {
        ...state,
        gettingAppliesToAttributesExist: false,
        gettingAppliesToAttributesExistError: true
      };
    case fromJobDescriptionAppliesToActions.GET_APPLIES_TO_ATTRIBUTES_EXIST_SUCCESS:
      return {
        ...state,
        gettingAppliesToAttributesExist: false,
        appliesToAttributesExist: cloneDeep(action.payload)
      };
    case fromJobDescriptionAppliesToActions.LOAD_JOB_DESCRIPTION_APPLIESTO:
      return {
        ...state,
        loadingJobDescriptionAppliesTo: true
      };
    case fromJobDescriptionAppliesToActions.LOAD_JOB_DESCRIPTION_APPLIESTO_ERROR:
      return {
        ...state,
        loadingJobDescriptionAppliesTo: false,
        loadingJobDescriptionAppliesToError: true
      };
    case fromJobDescriptionAppliesToActions.LOAD_JOB_DESCRIPTION_APPLIESTO_SUCCESS:
      return {
        ...state,
        loadingJobDescriptionAppliesTo: false,
        jobDescriptionAppliesToItems: cloneDeep(action.payload)
      };
    case fromJobDescriptionAppliesToActions.LOAD_JOB_DESCRIPTION_APPLIESTO_VALUES:
      return {
        ...state,
        loadingJobDescriptionAppliesToValues: true
      };
    case fromJobDescriptionAppliesToActions.LOAD_JOB_DESCRIPTION_APPLIESTO_VALUES_ERROR:
      return {
        ...state,
        loadingJobDescriptionAppliesToValues: false,
        loadingJobDescriptionAppliesToValuesError: true
      };
    case fromJobDescriptionAppliesToActions.LOAD_JOB_DESCRIPTION_APPLIESTO_VALUES_SUCCESS:
      return {
        ...state,
        loadingJobDescriptionAppliesToValues: false,
        jobDescriptionAppliesToValues: cloneDeep(action.payload)
      };
    case fromJobDescriptionAppliesToActions.RESET_APPLIES_TO_ATTRIBUTES_EXIST: {
      return {
        ...state,
        appliesToAttributesExist: null
      };
    }
    default:
      return state;
  }
}

export const getAppliesToAttributesExist = (state: State) => state.appliesToAttributesExist;
export const getAppliesToAttributesExistGetting = (state: State) => state.gettingAppliesToAttributesExist;
export const getAppliesToAttributesExistGettingError = (state: State) => state.gettingAppliesToAttributesExistError;
export const getJobDescriptionAppliesToItems = (state: State) => state.jobDescriptionAppliesToItems;
export const getJobDescriptionAppliesToValues = (state: State) => state.jobDescriptionAppliesToValues;
export const getJobDescriptionAppliesToLoading = (state: State) => state.loadingJobDescriptionAppliesTo;
export const getJobDescriptionAppliesToLoadingError = (state: State) => state.loadingJobDescriptionAppliesToError;
export const getJobDescriptionAppliesToValuesLoading = (state: State) => state.loadingJobDescriptionAppliesToValues;
export const getJobDescriptionAppliesToValuesLoadingError = (state: State) => state.loadingJobDescriptionAppliesToValuesError;
