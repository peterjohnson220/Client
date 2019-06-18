import { Action } from '@ngrx/store';

import { SystemUserGroupsResponse, CompanyIndustriesResponse, CompanyTilesResponse,
  CompanyDataSetsReponse, CompanyClientTypesReponse, ListCompositeFields, CompanySettingsSaveRequest} from 'libs/models/payfactors-api';
import { UserResponse } from 'libs/models/payfactors-api/user/response';
import { CompanySetting, CompanyFormData } from 'libs/models/company';

// Form
export const GET_SYSTEM_USER_GROUPS = '[Pf-Admin/Company Page] Get System User Groups';
export const GET_SYSTEM_USER_GROUPS_SUCCESS = '[Pf-Admin/Company Page] Get System User Groups Success';
export const GET_SYSTEM_USER_GROUPS_ERROR = '[Pf-Admin/Company Page] Get System User Groups Error';
export const GET_PF_SERVICES_REPS = '[Pf-Admin/Company Page] Get Pf Services Reps';
export const GET_PF_SERVICES_REPS_SUCCESS = '[Pf-Admin/Company Page] Get Pf Services Reps Success';
export const GET_PF_SERVICES_REPS_ERROR = '[Pf-Admin/Company Page] Get Pf Services Reps Error';
export const GET_PF_CUSTOMER_SUCCESS_MANAGERS = '[Pf-Admin/Company Page] Get Pf Customer Success Managers';
export const GET_PF_CUSTOMER_SUCCESS_MANAGERS_SUCCESS = '[Pf-Admin/Company Page] Get Pf Customer Success Managers Success';
export const GET_PF_CUSTOMER_SUCCESS_MANAGERS_ERROR = '[Pf-Admin/Company Page] Get Pf Customer Success Managers Error';
export const GET_COMPANY_INDUSTRIES = '[Pf-Admin/Company Page] Get Company Industries';
export const GET_COMPANY_INDUSTRIES_SUCCESS = '[Pf-Admin/Company Page] Get Company Industries Success';
export const GET_COMPANY_INDUSTRIES_ERROR = '[Pf-Admin/Company Page] Get Company Industries Error';
export const GET_PUBLIC_TOKEN_URL = '[Pf-Admin/Company Page] Get Public Token Url';
export const GET_PUBLIC_TOKEN_URL_SUCCESS = '[Pf-Admin/Company Page] Get Public Token Url Success';
export const GET_PUBLIC_TOKEN_URL_ERROR = '[Pf-Admin/Company Page] Get Public Token Url Error';
export const GET_COMPANY_CLIENT_TYPES = '[Pf-Admin/Company Page] Get Company Client Types';
export const GET_COMPANY_CLIENT_TYPES_SUCCESS = '[Pf-Admin/Company Page] Get Company Client Types Success';
export const GET_COMPANY_CLIENT_TYPES_ERROR = '[Pf-Admin/Company Page] Get Company Client Types Error';

// Tabs
export const GET_COMPANY_TILES = '[Pf-Admin/Company Page] Get Company Tiles';
export const GET_COMPANY_TILES_SUCCESS = '[Pf-Admin/Company Page] Get Company Tiles Success';
export const GET_COMPANY_TILES_ERROR = '[Pf-Admin/Company Page] Get Company Tiles Error';
export const GET_DEFAULT_SETTINGS = '[Pf-Admin/Company Page] Get Default Settings';
export const GET_DEFAULT_SETTINGS_SUCCESS = '[Pf-Admin/Company Page] Get Default Settings Success';
export const GET_DEFAULT_SETTINGS_ERROR = '[Pf-Admin/Company Page] Get Default Settings Error';
export const GET_COMPANY_DATA_SETS = '[Pf-Admin/Company Page] Get Company Data Sets';
export const GET_COMPANY_DATA_SETS_SUCCESS = '[Pf-Admin/Company Page] Get Company Data Sets Success';
export const GET_COMPANY_DATA_SETS_ERROR = '[Pf-Admin/Company Page] Get Company Data Sets Error';
export const GET_COMPOSITE_FIELDS = '[Pf-Admin/Company Page] Get Composite Fields';
export const GET_COMPOSITE_FIELDS_SUCCESS = '[Pf-Admin/Company Page] Get Composite Fields Success';
export const GET_COMPOSITE_FIELDS_ERROR = '[Pf-Admin/Company Page] Get Composite Fields Error';
export const TOGGLE_COMPANY_TILE = '[Pf-Admin/Company Page] Toggle Company Tile';
export const TOGGLE_COMPANY_DATA_SET = '[Pf-Admin/Company Page] Toggle Company Data Set';
export const TOGGLE_COMPANY_SETTING = '[Pf-Admin/Company Page] Toggle Company Setting';

// Actions bar
export const SAVE_COMPANY = '[Pf-Admin/Company Page] Save Company';
export const SAVE_COMPANY_SUCCESS = '[Pf-Admin/Company Page] Save Company Success';
export const SAVE_COMPANY_ERROR = '[Pf-Admin/Company Page] Save Company Error';
export const PUT_SETTINGS = '[Pf-Admin/Company Page] Put Settings';
export const PUT_SETTINGS_SUCCESS = '[Pf-Admin/Company Page] Put Settings Success';
export const PUT_SETTINGS_ERROR = '[Pf-Admin/Company Page] Put Settings Error';

// Client Type Select
export const SELECT_PEER_CLIENT_TYPE = '[Pf-Admin/Company Page] Select Peer Client Type';
export const SELECT_PEER_AND_ANALYSIS_CLIENT_TYPE = '[Pf-Admin/Company Page] Select Peer And Analysis Client Type';
export const SELECT_NON_PEER_CLIENT_TYPE = '[Pf-Admin/Company Page] Select Non-Peer Client Type';

export class GetSystemUserGroups implements Action {
  readonly type = GET_SYSTEM_USER_GROUPS;

  constructor() {}
}

export class GetSystemUserGroupsSuccess implements Action {
  readonly type = GET_SYSTEM_USER_GROUPS_SUCCESS;

  constructor( public payload: SystemUserGroupsResponse[] ) {}
}

export class GetSystemUserGroupsError implements Action {
  readonly type = GET_SYSTEM_USER_GROUPS_ERROR;

  constructor() {}
}

export class GetPfServicesReps implements Action {
  readonly type = GET_PF_SERVICES_REPS;

  constructor() {}
}

export class GetPfServicesRepsSuccess implements Action {
  readonly type = GET_PF_SERVICES_REPS_SUCCESS;

  constructor( public payload: UserResponse[] ) {}
}

export class GetPfServicesRepsError implements Action {
  readonly type = GET_PF_SERVICES_REPS_ERROR;

  constructor() {}
}

export class GetPfCustomerSuccessManagers implements Action {
  readonly type = GET_PF_CUSTOMER_SUCCESS_MANAGERS;

  constructor() {}
}

export class GetPfCustomerSuccessManagersSuccess implements Action {
  readonly type = GET_PF_CUSTOMER_SUCCESS_MANAGERS_SUCCESS;

  constructor( public payload: UserResponse[] ) {}
}

export class GetPfCustomerSuccessManagersError implements Action {
  readonly type = GET_PF_CUSTOMER_SUCCESS_MANAGERS_ERROR;

  constructor() {}
}

export class GetCompanyIndustries implements Action {
  readonly type = GET_COMPANY_INDUSTRIES;

  constructor() {}
}

export class GetCompanyIndustriesSuccess implements Action {
  readonly type = GET_COMPANY_INDUSTRIES_SUCCESS;

  constructor( public payload: CompanyIndustriesResponse[] ) {}
}

export class GetCompanyIndustriesError implements Action {
  readonly type = GET_COMPANY_INDUSTRIES_ERROR;

  constructor() {}
}

export class GetPublicTokenUrl implements Action {
  readonly type = GET_PUBLIC_TOKEN_URL;

  constructor( public payload: number ) {}
}

export class GetPublicTokenUrlSuccess implements Action {
  readonly type = GET_PUBLIC_TOKEN_URL_SUCCESS;

  constructor( public payload: string ) {}
}

export class GetPublicTokenUrlError implements Action {
  readonly type = GET_PUBLIC_TOKEN_URL_ERROR;

  constructor() {}
}

export class GetCompanyClientTypes implements Action {
  readonly type = GET_COMPANY_CLIENT_TYPES;

  constructor() {}
}

export class GetCompanyClientTypesSuccess implements Action {
  readonly type = GET_COMPANY_CLIENT_TYPES_SUCCESS;

  constructor( public payload: CompanyClientTypesReponse[] ) {}
}

export class GetCompanyClientTypesError implements Action {
  readonly type = GET_COMPANY_CLIENT_TYPES_ERROR;

  constructor() {}
}

// Tabs
export class GetCompanyTiles implements Action {
  readonly type = GET_COMPANY_TILES;

  constructor( public payload: number ) {}
}

export class GetCompanyTilesSuccess implements Action {
  readonly type = GET_COMPANY_TILES_SUCCESS;

  constructor( public payload: CompanyTilesResponse[] ) {}
}

export class GetCompanyTilesError implements Action {
  readonly type = GET_COMPANY_TILES_ERROR;

  constructor() {}
}

export class GetDefaultSettings implements Action {
  readonly type = GET_DEFAULT_SETTINGS;

  constructor() {}
}

export class GetDefaultSettingsSuccess implements Action {
  readonly type = GET_DEFAULT_SETTINGS_SUCCESS;

  constructor( public payload: CompanySetting[] ) {}
}

export class GetDefaultSettingsError implements Action {
  readonly type = GET_DEFAULT_SETTINGS_ERROR;

  constructor() {}
}

export class GetCompanyDataSets implements Action {
  readonly type = GET_COMPANY_DATA_SETS;

  constructor( public payload: number ) {}
}

export class GetCompanyDataSetsSuccess implements Action {
  readonly type = GET_COMPANY_DATA_SETS_SUCCESS;

  constructor( public payload: CompanyDataSetsReponse[] ) {}
}

export class GetCompanyDataSetsError implements Action {
  readonly type = GET_COMPANY_DATA_SETS_ERROR;

  constructor() {}
}

export class GetCompositeFields implements Action {
  readonly type = GET_COMPOSITE_FIELDS;

  constructor() {}
}

export class GetCompositeFieldsSuccess implements Action {
  readonly type = GET_COMPOSITE_FIELDS_SUCCESS;

  constructor( public payload: ListCompositeFields[] ) {}
}

export class GetCompositeFieldsError implements Action {
  readonly type = GET_COMPOSITE_FIELDS_ERROR;

  constructor() {}
}

export class ToggleCompanyTile implements Action {
  readonly type = TOGGLE_COMPANY_TILE;

  constructor( public payload: CompanyTilesResponse ) {}
}

export class ToggleCompanyDataSet implements Action {
  readonly type = TOGGLE_COMPANY_DATA_SET;

  constructor( public payload: CompanyDataSetsReponse ) {}
}

export class ToggleCompanySetting implements Action {
  readonly type = TOGGLE_COMPANY_SETTING;

  constructor( public payload: CompanySetting ) {}
}

// Actions bar
export class SaveCompany implements Action {
  readonly type = SAVE_COMPANY;

  constructor( public payload: CompanyFormData ) {}
}

export class SaveCompanySuccess implements Action {
  readonly type = SAVE_COMPANY_SUCCESS;

  constructor() {}
}

export class SaveCompanyError implements Action {
  readonly type = SAVE_COMPANY_ERROR;

  constructor() {}
}

export class PutSettings implements Action {
  readonly type = PUT_SETTINGS;

  constructor( public payload: CompanySettingsSaveRequest ) {}
}

export class PutSettingsSuccess implements Action {
  readonly type = PUT_SETTINGS_SUCCESS;

  constructor() {}
}

export class PutSettingsError implements Action {
  readonly type = PUT_SETTINGS_ERROR;

  constructor() {}
}

// Client Type Select
export class SelectPeerClientType implements Action {
  readonly type = SELECT_PEER_CLIENT_TYPE;

  constructor() {}
}

export class SelectPeerAndAnalysisClientType implements Action {
  readonly type = SELECT_PEER_AND_ANALYSIS_CLIENT_TYPE;

  constructor() {}
}

export class SelectNonPeerClientType implements Action {
  readonly type = SELECT_NON_PEER_CLIENT_TYPE;

  constructor() {}
}

export type Actions
  = GetSystemUserGroups
  | GetSystemUserGroupsSuccess
  | GetSystemUserGroupsError
  | GetPfServicesReps
  | GetPfServicesRepsSuccess
  | GetPfServicesRepsError
  | GetPfCustomerSuccessManagers
  | GetPfCustomerSuccessManagersSuccess
  | GetPfCustomerSuccessManagersError
  | GetCompanyIndustries
  | GetCompanyIndustriesSuccess
  | GetCompanyIndustriesError
  | GetPublicTokenUrl
  | GetPublicTokenUrlSuccess
  | GetPublicTokenUrlError
  | GetCompanyClientTypes
  | GetCompanyClientTypesSuccess
  | GetCompanyClientTypesError
  | GetCompanyTiles
  | GetCompanyTilesSuccess
  | GetCompanyTilesError
  | GetDefaultSettings
  | GetDefaultSettingsSuccess
  | GetDefaultSettingsError
  | GetCompanyDataSets
  | GetCompanyDataSetsSuccess
  | GetCompanyDataSetsError
  | GetCompositeFields
  | GetCompositeFieldsSuccess
  | GetCompositeFieldsError
  | ToggleCompanyTile
  | ToggleCompanyDataSet
  | ToggleCompanySetting
  | SaveCompany
  | SaveCompanySuccess
  | SaveCompanyError
  | PutSettings
  | PutSettingsSuccess
  | PutSettingsError
  | SelectPeerClientType
  | SelectPeerAndAnalysisClientType
  | SelectNonPeerClientType;
