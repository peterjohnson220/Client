import { CompanyBaseInformation } from 'libs/models/company';
import { PayElement, UdfSetting } from 'libs/models/payfactors-api/survey/response/udf-data-response.model';

import * as fromUdfManagerActions from '../actions/udf-manager.actions';

export interface State {
  loadingCompanies: boolean;
  loadingCompaniesError: boolean;
  companiesList: CompanyBaseInformation[];
  selectedCompany: CompanyBaseInformation;
  udfSettings: UdfSetting[];
  payElements: PayElement[];
  loadingUdfs: boolean;
  loadingUdfsError: boolean;
  confirmSave: boolean;
  savingUdfs: boolean;
  savingUdfsError: boolean;
  savingUdfsErrorMessage: string;
}

const initialState: State = {
  loadingCompanies: true,
  loadingCompaniesError: false,
  companiesList: [],
  selectedCompany: null,
  udfSettings: [],
  payElements: [],
  loadingUdfs: false,
  loadingUdfsError: false,
  confirmSave: false,
  savingUdfs: false,
  savingUdfsError: false,
  savingUdfsErrorMessage: ''
};

export function reducer(state = initialState, action: fromUdfManagerActions.UdfManagerActions): State {
  switch (action.type) {
    case fromUdfManagerActions.LOAD_UDF_COMPANIES:
      return {
        ...state,
        loadingCompanies: true
      };
    case fromUdfManagerActions.LOAD_UDF_COMPANIES_SUCCESS:
      return {
        ...state,
        loadingCompanies: false,
        companiesList: action.payload
      };
    case fromUdfManagerActions.LOAD_UDF_COMPANIES_ERROR:
      return {
        ...state,
        loadingCompanies: false,
        loadingCompaniesError: true
      };
    case fromUdfManagerActions.SET_SELECTED_COMPANY:
      return {
        ...state,
        selectedCompany: action.payload
      };
    case fromUdfManagerActions.UNSELECT_COMPANY:
      return {
        ...state,
        selectedCompany: null,
        udfSettings: []
      };
    case fromUdfManagerActions.GET_SURVEY_UDFS:
      return {
        ...state,
        loadingUdfs: true
      };
    case fromUdfManagerActions.GET_SURVEY_UDFS_SUCCESS:
      return {
        ...state,
        loadingUdfs: false,
        udfSettings: action.payload.UdfSettings,
        payElements: action.payload.PayElements
      };
    case fromUdfManagerActions.GET_SURVEY_UDFS_ERROR:
      return {
        ...state,
        loadingUdfs: false,
        loadingUdfsError: true
      };
    case fromUdfManagerActions.CONFIRM_SAVE:
      return {
        ...state,
        confirmSave: true
      };
    case fromUdfManagerActions.DISMISS_SAVE:
      return {
        ...state,
        confirmSave: false
      };
    case fromUdfManagerActions.SAVE_SURVEY_UDFS:
      return {
        ...state,
        savingUdfs: true,
        savingUdfsError: false,
        savingUdfsErrorMessage: '',
        confirmSave: false,
      };
    case fromUdfManagerActions.SAVE_SURVEY_UDFS_SUCCESS:
      return {
        ...state,
        savingUdfs: false
      };
    case fromUdfManagerActions.SAVE_SURVEY_UDFS_ERROR:
      return {
        ...state,
        savingUdfs: false,
        savingUdfsError: true,
        savingUdfsErrorMessage: action.payload.error
      };
      default:
        return state;
  }
}

export const getSelectedCompany = (state: State) => state.selectedCompany;

export const getConfirmSave = (state: State) => state.confirmSave;

export const getUdfSettings = (state: State) => state.udfSettings;
export const getUdfsLoading = (state: State) => state.loadingUdfs;
export const getUdfsLoadingError = (state: State) => state.loadingUdfsError;

export const getCompaniesLoading = (state: State) => state.loadingCompanies;
export const getCompaniesLoadingError = (state: State) => state.loadingCompaniesError;
export const getCompaniesList = (state: State) => state.companiesList;

export const getPayElements = (state: State) => state.payElements;

export const getSavingUdfsError = (state: State) => state.savingUdfsError;
export const getSavingUdfsErrorMessage = (state: State) => state.savingUdfsErrorMessage;
