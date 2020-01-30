import { Action } from '@ngrx/store';

import { UserContext } from 'libs/models/security';
import { UserBulkAdd } from 'libs/models/admin/user-bulk-add.model';

export const STORE_FILE_NAME_IN_SESSION_SUCCESS = '[Company Admin - Bulk Add Users] Store File Name In Session Success';
export const STORE_FILE_NAME_IN_SESSION_ERROR = '[Company Admin - Bulk Add Users] Store File Name In Session Error';
export const STORE_FILE_NAME_IN_SESSION = '[Company Admin - Bulk Add Users] Store File Name In Session';
export const STORE_AND_MAP_BULK_ADD_USERS_IN_SESSION_SUCCESS = '[Company Admin - Bulk Add Users] Store And Map Bulk Add Users In Session Success';
export const STORE_AND_MAP_BULK_ADD_USERS_IN_SESSION_ERROR = '[Company Admin - Bulk Add Users] Store And Map Bulk Add Users In Session Error';
export const STORE_AND_MAP_BULK_ADD_USERS_IN_SESSION = '[Company Admin - Bulk Add Users] Store And Map Bulk Add Users In Session';
export const STORE_WORKSHEET_NAMES = '[Company Admin - Bulk Add Users] Store Worksheet Names';
export const STORE_PASSWORD_REQUIREMENT = '[Company Admin - Bulk Add Users] Store Password Requirement';
export const VALIDATE_HEADERS_SUCCESS = '[Company Admin - Bulk Add Users] Validate Headers Success';
export const VALIDATE_HEADERS_ERROR = '[Company Admin - Bulk Add Users] Validate Headers Error';
export const VALIDATE_HEADERS = '[Company Admin - Bulk Add Users] Validate Headers';
export const VALIDATE_REQUIRED_FIELDS_SUCCESS = '[Company Admin - Bulk Add Users] Validate Required Fields Success';
export const VALIDATE_REQUIRED_FIELDS_ERROR = '[Company Admin - Bulk Add Users] Validate Required Fields Error';
export const VALIDATE_REQUIRED_FIELDS = '[Company Admin - Bulk Add Users] Validate Required Fields';
export const VALIDATE_EMAILS_SUCCESS = '[Company Admin - Bulk Add Users] Validate Emails Success';
export const VALIDATE_EMAILS_ERROR = '[Company Admin - Bulk Add Users] Validate Emails Error';
export const VALIDATE_EMAILS = '[Company Admin - Bulk Add Users] Validate Emails';
export const VALIDATE_PASSWORDS_SUCCESS = '[Company Admin - Bulk Add Users] Validate Passwords Success';
export const VALIDATE_PASSWORDS_ERROR = '[Company Admin - Bulk Add Users] Validate Passwords Error';
export const VALIDATE_PASSWORDS = '[Company Admin - Bulk Add Users] Validate Passwords';
export const VALIDATE_USER_ROLES_SUCCESS = '[Company Admin - Bulk Add Users] Validate User Roles Success';
export const VALIDATE_USER_ROLES_ERROR = '[Company Admin - Bulk Add Users] Validate User Roles Error';
export const VALIDATE_USER_ROLES = '[Company Admin - Bulk Add Users] Validate User Roles';
export const DOWNLOAD_DATA_FILE_WITH_ERRORS_SUCCESS = '[Company Admin - Bulk Add Users] Download Data File With Errors Success';
export const DOWNLOAD_DATA_FILE_WITH_ERRORS_ERROR = '[Company Admin - Bulk Add Users] Download Data File With Errors Error';
export const DOWNLOAD_DATA_FILE_WITH_ERRORS = '[Company Admin - Bulk Add Users] Download Data File With Errors';
export const GET_IMPORT_COUNT_SUCCESS = '[Company Admin - Bulk Add Users] Get Import Count Success';
export const GET_IMPORT_COUNT_ERROR = '[Company Admin - Bulk Add Users] Get Import Count Error';
export const GET_IMPORT_COUNT = '[Company Admin - Bulk Add Users] Get Import Count';
export const SAVE_BULK_ADD_USERS_SUCCESS = '[Company Admin - Bulk Add Users] Save Bulk Add Users Success';
export const SAVE_BULK_ADD_USERS_ERROR = '[Company Admin - Bulk Add Users] Save Bulk Add Users Error';
export const SAVE_BULK_ADD_USERS = '[Company Admin - Bulk Add Users] Save Bulk Add Users';
export const GET_COMPANY_PASSWORD_LENGTH_SUCCESS = '[Company Admin - Bulk Add Users] Get Company Password Length Success';
export const GET_COMPANY_PASSWORD_LENGTH_ERROR = '[Company Admin - Bulk Add Users] Get Company Password Length Error';
export const GET_COMPANY_PASSWORD_LENGTH = '[Company Admin - Bulk Add Users] Get Company Password Length';
export const SHOW_BULK_ADD_USERS_LOADER_UPLOAD_PANEL = '[Company Admin - Bulk Add Users] Show Loader Upload Panel';
export const SHOW_BULK_ADD_USERS_LOADER_IMPORT_VALIDATION = '[Company Admin - Bulk Add Users] Show Loader Import Validation';
export const SHOW_BULK_ADD_USERS_LOADER_IMPORT_SUMMARY = '[Company Admin - Bulk Add Users] Show Loader Import Summary';
export const SHOW_BULK_ADD_USERS_LOADER_IMPORT_PANEL = '[Company Admin - Bulk Add Users] Show Loader Import Panel';
export const RESET_ALL = '[Company Admin - Bulk Add Users] Reset State';
export const GET_USER_CONTEXT = '[Company Admin - Bulk Add Users] Get User Context';
export const GET_USER_CONTEXT_SUCCESS = '[Company Admin - Bulk Add Users] Get User Context Success';

export class ShowBulkAddUsersLoaderUploadPanel implements Action {
  readonly type = SHOW_BULK_ADD_USERS_LOADER_UPLOAD_PANEL;
}

export class ShowBulkAddUsersLoaderImportValidation implements Action {
  readonly type = SHOW_BULK_ADD_USERS_LOADER_IMPORT_VALIDATION;
}

export class ShowBulkAddUsersLoaderImportSummary implements Action {
  readonly type = SHOW_BULK_ADD_USERS_LOADER_IMPORT_SUMMARY;
}

export class ShowBulkAddUsersLoaderImportPanel implements Action {
  readonly type = SHOW_BULK_ADD_USERS_LOADER_IMPORT_PANEL;
}

export class GetCompanyPasswordLength implements Action {
  readonly type = GET_COMPANY_PASSWORD_LENGTH;
}

export class GetCompanyPasswordLengthSuccess implements Action {
  readonly type = GET_COMPANY_PASSWORD_LENGTH_SUCCESS;

  constructor(public payload: number) {}
}

export class GetCompanyPasswordLengthError implements Action {
  readonly type = GET_COMPANY_PASSWORD_LENGTH_ERROR;
}

export class SaveBulkAddUsers implements Action {
  readonly type = SAVE_BULK_ADD_USERS;

  constructor(public payload: UserBulkAdd) {}
}

export class SaveBulkAddUsersSuccess implements Action {
  readonly type = SAVE_BULK_ADD_USERS_SUCCESS;

  constructor(public payload: string) {}
}

export class SaveBulkAddUsersError implements Action {
  readonly type = SAVE_BULK_ADD_USERS_ERROR;
}

export class GetImportCount implements Action {
  readonly type = GET_IMPORT_COUNT;
}

export class GetImportCountSuccess implements Action {
  readonly type = GET_IMPORT_COUNT_SUCCESS;

  constructor(public payload: string) {}
}

export class GetImportCountError implements Action {
  readonly type = GET_IMPORT_COUNT_ERROR;
}

export class DownloadDataFileWithErrors implements Action {
  readonly type = DOWNLOAD_DATA_FILE_WITH_ERRORS;

  constructor(public payload: { companyId: number, bulkAddUsersValidationErrors: any}) {}
}

export class DownloadDataFileWithErrorsSuccess implements Action {
  readonly type = DOWNLOAD_DATA_FILE_WITH_ERRORS_SUCCESS;

}

export class DownloadDataFileWithErrorsError implements Action {
  readonly type = DOWNLOAD_DATA_FILE_WITH_ERRORS_ERROR;
}

export class ValidateUserRoles implements Action {
  readonly type = VALIDATE_USER_ROLES;

  constructor(public payload: number) {}
}

export class ValidateUserRolesSuccess implements Action {
  readonly type = VALIDATE_USER_ROLES_SUCCESS;

  constructor(public payload: string) {}
}

export class ValidateUserRolesError implements Action {
  readonly type = VALIDATE_USER_ROLES_ERROR;
}

export class ValidatePasswords implements Action {
  readonly type = VALIDATE_PASSWORDS;

  constructor(public payload: number) {}
}

export class ValidatePasswordsSuccess implements Action {
  readonly type = VALIDATE_PASSWORDS_SUCCESS;

  constructor(public payload: string) {}
}

export class ValidatePasswordsError implements Action {
  readonly type = VALIDATE_PASSWORDS_ERROR;
}

export class ValidateEmails implements Action {
  readonly type = VALIDATE_EMAILS;
}

export class ValidateEmailsSuccess implements Action {
  readonly type = VALIDATE_EMAILS_SUCCESS;

  constructor(public payload: string) {}
}

export class ValidateEmailsError implements Action {
  readonly type = VALIDATE_EMAILS_ERROR;
}

export class ValidateRequiredFields implements Action {
  readonly type = VALIDATE_REQUIRED_FIELDS;

  constructor(public payload: number) {}
}

export class ValidateRequiredFieldsSuccess implements Action {
  readonly type = VALIDATE_REQUIRED_FIELDS_SUCCESS;

  constructor(public payload: string) {}
}

export class ValidateRequiredFieldsError implements Action {
  readonly type = VALIDATE_REQUIRED_FIELDS_ERROR;
}

export class ValidateHeaders implements Action {
  readonly type = VALIDATE_HEADERS;

  constructor(public payload: UserBulkAdd) {}
}

export class ValidateHeadersSuccess implements Action {
  readonly type = VALIDATE_HEADERS_SUCCESS;

  constructor(public payload: string) {}
}

export class ValidateHeadersError implements Action {
  readonly type = VALIDATE_HEADERS_ERROR;
}

export class StorePasswordRequirement implements Action {
  readonly type = STORE_PASSWORD_REQUIREMENT;

  constructor(public payload: number) {}
}

export class StoreWorksheetNames implements Action {
  readonly type = STORE_WORKSHEET_NAMES;

  constructor(public payload: string[]) {}
}

export class StoreFileNameInSession implements Action {
  readonly type = STORE_FILE_NAME_IN_SESSION;

  constructor(public payload: string) {}
}

export class StoreFileNameInSessionSuccess implements Action {
  readonly type = STORE_FILE_NAME_IN_SESSION_SUCCESS;

  constructor(public payload: string) {}
}

export class StoreFileNameInSessionError implements Action {
  readonly type = STORE_FILE_NAME_IN_SESSION_ERROR;
}

export class StoreAndMapBulkAddUsersInSession implements Action {
  readonly type = STORE_AND_MAP_BULK_ADD_USERS_IN_SESSION;

  constructor(public payload: UserBulkAdd) {}
}

export class StoreAndMapBulkAddUsersInSessionSuccess implements Action {
  readonly type = STORE_AND_MAP_BULK_ADD_USERS_IN_SESSION_SUCCESS;

  constructor(public payload: string) {}
}

export class StoreAndMapBulkAddUsersInSessionError implements Action {
  readonly type = STORE_AND_MAP_BULK_ADD_USERS_IN_SESSION_ERROR;
}

export class ResetAll implements  Action {
  readonly  type = RESET_ALL;
}

export class GetUserContext implements  Action {
  readonly  type = GET_USER_CONTEXT;
}

export class GetUserContextSuccess implements  Action {
  readonly  type = GET_USER_CONTEXT_SUCCESS;

  constructor(public payload: UserContext) {}
}

export type UserBulkAddSettings
  = StoreFileNameInSession
  | StoreFileNameInSessionSuccess
  | StoreFileNameInSessionError
  | StoreAndMapBulkAddUsersInSession
  | StoreAndMapBulkAddUsersInSessionSuccess
  | StoreAndMapBulkAddUsersInSessionError
  | StoreWorksheetNames
  | StorePasswordRequirement
  | ValidateHeaders
  | ValidateHeadersSuccess
  | ValidateHeadersError
  | ValidateRequiredFields
  | ValidateRequiredFieldsSuccess
  | ValidateRequiredFieldsError
  | ValidateEmails
  | ValidateEmailsSuccess
  | ValidateEmailsError
  | ValidatePasswords
  | ValidatePasswordsSuccess
  | ValidatePasswordsError
  | ValidateUserRoles
  | ValidateUserRolesSuccess
  | ValidateUserRolesError
  | DownloadDataFileWithErrors
  | DownloadDataFileWithErrorsSuccess
  | DownloadDataFileWithErrorsError
  | GetImportCount
  | GetImportCountSuccess
  | GetImportCountError
  | SaveBulkAddUsers
  | SaveBulkAddUsersSuccess
  | SaveBulkAddUsersError
  | GetCompanyPasswordLength
  | GetCompanyPasswordLengthSuccess
  | GetCompanyPasswordLengthError
  | ShowBulkAddUsersLoaderUploadPanel
  | ShowBulkAddUsersLoaderImportSummary
  | ShowBulkAddUsersLoaderImportPanel
  | ShowBulkAddUsersLoaderImportValidation
  | ResetAll
  | GetUserContext
  | GetUserContextSuccess;
