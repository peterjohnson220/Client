import { UserContext } from 'libs/models/security';

import * as fromUserBulkAddActions from '../actions/user-bulk-add.action';

export enum LoaderState {
  Loading,
  UploadPanel,
  ImportValidation,
  ImportSummary,
  ImportPanel
}

export interface State {
  storeFileNameInSession: boolean;
  storeFileNameInSessionSuccess: any;
  storeFileNameInSessionError: boolean;
  storeAndMapBulkAddUsersInSession: boolean;
  storeAndMapBulkAddUsersInSessionSuccess: any;
  storeAndMapBulkAddUsersInSessionError: boolean;
  saveUsers: boolean;
  saveUsersSuccess: any;
  saveUsersError: boolean;
  getImportCount: boolean;
  getImportCountSuccess: any;
  getImportCountError: boolean;
  validateHeaders: boolean;
  validateHeadersSuccess: any;
  validateHeadersError: boolean;
  validateRequiredFields: boolean;
  validateRequiredFieldsSuccess: any;
  validateRequiredFieldsError: boolean;
  validateEmails: boolean;
  validateEmailsSuccess: any;
  validateEmailsError: boolean;
  validatePasswords: boolean;
  validatePasswordsSuccess: any;
  validatePasswordsError: boolean;
  validateUserRoles: boolean;
  validateUserRolesSuccess: any;
  validateUserRolesError: boolean;
  downloadDataFileWithErrors: boolean;
  downloadDataFileWithErrorsSuccess: any;
  downloadDataFileWithErrorsError: boolean;
  loaderState: LoaderState;
  worksheetNames: string[];
  userContext: UserContext;
  passwordLengthRequirement: number;
  getCompanyPasswordLength: boolean;
  getCompanyPasswordLengthError: boolean;
  companyLoading: boolean;
  companyLoadingError: boolean;
  company: string;
}

export const initialState: State = {
  loaderState: LoaderState.Loading,
  worksheetNames: [],
  storeFileNameInSession: false,
  storeFileNameInSessionError: false,
  storeFileNameInSessionSuccess: null,
  storeAndMapBulkAddUsersInSession: false,
  storeAndMapBulkAddUsersInSessionError: false,
  storeAndMapBulkAddUsersInSessionSuccess: null,
  saveUsers: false,
  saveUsersSuccess: null,
  saveUsersError: false,
  getImportCount: false,
  getImportCountError: false,
  getImportCountSuccess: null,
  validateHeaders: false,
  validateHeadersError: false,
  validateHeadersSuccess: null,
  validateRequiredFields: false,
  validateRequiredFieldsError: false,
  validateRequiredFieldsSuccess: null,
  validateEmails: false,
  validateEmailsError: false,
  validateEmailsSuccess: null,
  validatePasswords: false,
  validatePasswordsError: false,
  validatePasswordsSuccess: null,
  validateUserRoles: false,
  validateUserRolesError: false,
  validateUserRolesSuccess: null,
  downloadDataFileWithErrors: false,
  downloadDataFileWithErrorsError: false,
  downloadDataFileWithErrorsSuccess: null,
  userContext: null,
  passwordLengthRequirement: 8,
  getCompanyPasswordLengthError: false,
  getCompanyPasswordLength: false,
  companyLoading: false,
  companyLoadingError: false,
  company: ''
};

export function reducer (state = initialState, action: fromUserBulkAddActions.UserBulkAddSettings): State {
  switch (action.type) {
    case fromUserBulkAddActions.SHOW_BULK_ADD_USERS_LOADER_UPLOAD_PANEL:
      return {
        ...state,
        loaderState: LoaderState.UploadPanel
      };
    case fromUserBulkAddActions.SHOW_BULK_ADD_USERS_LOADER_IMPORT_VALIDATION:
      return {
        ...state,
        loaderState: LoaderState.ImportValidation
      };
    case fromUserBulkAddActions.SHOW_BULK_ADD_USERS_LOADER_IMPORT_SUMMARY:
      return {
        ...state,
        loaderState: LoaderState.ImportSummary
      };
    case fromUserBulkAddActions.SHOW_BULK_ADD_USERS_LOADER_IMPORT_PANEL:
      return {
        ...state,
        loaderState: LoaderState.ImportPanel
      };
    case fromUserBulkAddActions.STORE_WORKSHEET_NAMES:
      return {
        ...state,
        worksheetNames:  action.payload
      };
    case fromUserBulkAddActions.STORE_FILE_NAME_IN_SESSION:
      return{
        ...state,
        storeFileNameInSession: true
      };
    case fromUserBulkAddActions.STORE_FILE_NAME_IN_SESSION_SUCCESS:
      return{
        ...state,
        storeFileNameInSession: false,
        storeFileNameInSessionSuccess: action.payload,
        storeFileNameInSessionError: false
      };
    case fromUserBulkAddActions.STORE_FILE_NAME_IN_SESSION_ERROR:
      return{
        ...state,
        storeFileNameInSession: false,
        storeFileNameInSessionSuccess: null,
        storeFileNameInSessionError: true
      };
    case fromUserBulkAddActions.STORE_AND_MAP_BULK_ADD_USERS_IN_SESSION:
      return{
        ...state,
        storeAndMapBulkAddUsersInSession: true
      };
    case fromUserBulkAddActions.STORE_AND_MAP_BULK_ADD_USERS_IN_SESSION_SUCCESS:
      return{
        ...state,
        storeAndMapBulkAddUsersInSession: false,
        storeAndMapBulkAddUsersInSessionSuccess: action.payload,
        storeAndMapBulkAddUsersInSessionError: false
      };
    case fromUserBulkAddActions.STORE_AND_MAP_BULK_ADD_USERS_IN_SESSION_ERROR:
      return{
        ...state,
        storeAndMapBulkAddUsersInSession: false,
        storeAndMapBulkAddUsersInSessionSuccess: null,
        storeAndMapBulkAddUsersInSessionError: true
      };
    case fromUserBulkAddActions.VALIDATE_HEADERS:
      return{
        ...state,
        validateHeaders: true
      };
    case fromUserBulkAddActions.VALIDATE_HEADERS_SUCCESS:
      return{
        ...state,
        validateHeaders: false,
        validateHeadersSuccess: action.payload,
        validateHeadersError: false
      };
    case fromUserBulkAddActions.VALIDATE_HEADERS_ERROR:
      return{
        ...state,
        validateHeaders: false,
        validateHeadersSuccess: null,
        validateHeadersError: true
      };
    case fromUserBulkAddActions.VALIDATE_REQUIRED_FIELDS:
      return{
        ...state,
        validateRequiredFields: true
      };
    case fromUserBulkAddActions.VALIDATE_REQUIRED_FIELDS_SUCCESS:
      return{
        ...state,
        validateRequiredFields: false,
        validateRequiredFieldsSuccess: action.payload,
        validateRequiredFieldsError: false
      };
    case fromUserBulkAddActions.VALIDATE_REQUIRED_FIELDS_ERROR:
      return{
        ...state,
        validateRequiredFields: false,
        validateRequiredFieldsSuccess: null,
        validateRequiredFieldsError: true
      };
    case fromUserBulkAddActions.VALIDATE_EMAILS:
      return{
        ...state,
        validateEmails: true
      };
    case fromUserBulkAddActions.VALIDATE_EMAILS_SUCCESS:
      return{
        ...state,
        validateEmails: false,
        validateEmailsSuccess: action.payload,
        validateEmailsError: false
      };
    case fromUserBulkAddActions.VALIDATE_EMAILS_ERROR:
      return{
        ...state,
        validateEmails: false,
        validateEmailsSuccess: null,
        validateEmailsError: true
      };
    case fromUserBulkAddActions.VALIDATE_PASSWORDS:
      return{
        ...state,
        validatePasswords: true
      };
    case fromUserBulkAddActions.VALIDATE_PASSWORDS_SUCCESS:
      return{
        ...state,
        validatePasswords: false,
        validatePasswordsSuccess: action.payload,
        validatePasswordsError: false
      };
    case fromUserBulkAddActions.VALIDATE_PASSWORDS_ERROR:
      return{
        ...state,
        validatePasswords: false,
        validatePasswordsSuccess: null,
        validatePasswordsError: true
      };
    case fromUserBulkAddActions.VALIDATE_USER_ROLES:
      return{
        ...state,
        validateUserRoles: true
      };
    case fromUserBulkAddActions.VALIDATE_USER_ROLES_SUCCESS:
      return{
        ...state,
        validateUserRoles: false,
        validateUserRolesSuccess: action.payload,
        validateUserRolesError: false
      };
    case fromUserBulkAddActions.VALIDATE_USER_ROLES_ERROR:
      return{
        ...state,
        validateUserRoles: false,
        validateUserRolesSuccess: null,
        validateUserRolesError: true
      };
    case fromUserBulkAddActions.DOWNLOAD_DATA_FILE_WITH_ERRORS:
      return{
        ...state,
        downloadDataFileWithErrors: true
      };
    case fromUserBulkAddActions.DOWNLOAD_DATA_FILE_WITH_ERRORS_SUCCESS:
      return{
        ...state,
        downloadDataFileWithErrors: false,
        downloadDataFileWithErrorsSuccess: null,
        downloadDataFileWithErrorsError: false
      };
    case fromUserBulkAddActions.DOWNLOAD_DATA_FILE_WITH_ERRORS_ERROR:
      return{
        ...state,
        downloadDataFileWithErrors: false,
        downloadDataFileWithErrorsSuccess: null,
        downloadDataFileWithErrorsError: true
      };
    case fromUserBulkAddActions.GET_IMPORT_COUNT:
      return{
        ...state,
        getImportCount: true
      };
    case fromUserBulkAddActions.GET_IMPORT_COUNT_SUCCESS:
      return{
        ...state,
        getImportCount: false,
        getImportCountSuccess: action.payload,
        getImportCountError: false
      };
    case fromUserBulkAddActions.GET_IMPORT_COUNT_ERROR:
      return{
        ...state,
        getImportCount: false,
        getImportCountSuccess: null,
        getImportCountError: true
      };
    case fromUserBulkAddActions.SAVE_BULK_ADD_USERS:
      return{
        ...state,
        saveUsers: true
      };
    case fromUserBulkAddActions.SAVE_BULK_ADD_USERS_SUCCESS:
      return{
        ...state,
        saveUsers: false,
        saveUsersSuccess: action.payload,
        saveUsersError: false
      };
    case fromUserBulkAddActions.SAVE_BULK_ADD_USERS_ERROR:
      return{
        ...state,
        saveUsers: false,
        saveUsersSuccess: null,
        saveUsersError: true
      };
    case fromUserBulkAddActions.GET_COMPANY_PASSWORD_LENGTH:
      return{
        ...state,
        passwordLengthRequirement: null,
        getCompanyPasswordLengthError: false,
        getCompanyPasswordLength: true
      };
    case fromUserBulkAddActions.GET_COMPANY_PASSWORD_LENGTH_SUCCESS:
      return{
        ...state,
        passwordLengthRequirement: action.payload,
        getCompanyPasswordLengthError: false,
        getCompanyPasswordLength: false
      };
    case fromUserBulkAddActions.GET_COMPANY_PASSWORD_LENGTH_ERROR:
      return{
        ...state,
        passwordLengthRequirement: 8,
        getCompanyPasswordLengthError: true,
        getCompanyPasswordLength: false
      };
    case fromUserBulkAddActions.RESET_ALL:
      return{
        ...initialState
      };
    default:
      return state;
  }
}

export const getLoaderState = (state: State) => state.loaderState;
export const getWorksheetNames = (state: State) => state.worksheetNames;
export const getStoreFileNameInSession = (state: State) => state.storeFileNameInSession;
export const getStoreFileNameInSessionSuccess = (state: State) => state.storeFileNameInSessionSuccess;
export const getStoreFileNameInSessionError = (state: State) => state.storeFileNameInSessionError;
export const getStoreAndMapBulkAddUsersInSession = (state: State) => state.storeAndMapBulkAddUsersInSession;
export const getStoreAndMapBulkAddUsersInSessionSuccess = (state: State) => state.storeAndMapBulkAddUsersInSessionSuccess;
export const getStoreAndMapBulkAddUsersInSessionError = (state: State) => state.storeAndMapBulkAddUsersInSessionError;
export const getSaveUsers = (state: State) => state.saveUsers;
export const getSaveUsersSuccess = (state: State) => state.saveUsersSuccess;
export const getSaveUsersError = (state: State) => state.saveUsersError;
export const getImportCount = (state: State) => state.getImportCount;
export const getImportCountSuccess = (state: State) => state.getImportCountSuccess;
export const getImportCountError = (state: State) => state.getImportCountError;
export const getValidateHeaders = (state: State) => state.validateHeaders;
export const getValidateHeadersSuccess = (state: State) => state.validateHeadersSuccess;
export const getValidateHeadersError = (state: State) => state.validateHeadersError;
export const getValidateRequiredFields = (state: State) => state.validateRequiredFields;
export const getValidateRequiredFieldsSuccess = (state: State) => state.validateRequiredFieldsSuccess;
export const getValidateRequiredFieldsError = (state: State) => state.validateRequiredFieldsError;
export const getValidateEmails = (state: State) => state.validateEmails;
export const getValidateEmailsSuccess = (state: State) => state.validateEmailsSuccess;
export const getValidateEmailsError = (state: State) => state.validateEmailsError;
export const getValidatePasswords = (state: State) => state.validatePasswords;
export const getValidatePasswordsSuccess = (state: State) => state.validatePasswordsSuccess;
export const getValidatePasswordsError = (state: State) => state.validatePasswordsError;
export const getValidateUserRoles = (state: State) => state.validateUserRoles;
export const getValidateUserRolesSuccess = (state: State) => state.validateUserRolesSuccess;
export const getValidateUserRolesError = (state: State) => state.validateUserRolesError;
export const getDownloadDataFileWithErrors = (state: State) => state.downloadDataFileWithErrors;
export const getDownloadDataFileWithErrorsSuccess = (state: State) => state.downloadDataFileWithErrorsSuccess;
export const getDownloadDataFileWithErrorsError = (state: State) => state.downloadDataFileWithErrorsError;
export const getCompanyPasswordLength = (state: State) => state.getCompanyPasswordLength;
export const getCompanyPasswordLengthSuccess = (state: State) => state.passwordLengthRequirement;
export const getCompanyPasswordLengthError = (state: State) => state.getCompanyPasswordLengthError;

