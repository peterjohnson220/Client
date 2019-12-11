import { Action } from '@ngrx/store';

import { SystemUserGroupsResponse, CompanyIndustriesResponse, CompanyTilesResponse,
  CompanyDataSetsReponse, CompanyClientTypesReponse, ListCompositeFields, CompanySettingsSaveRequest} from 'libs/models/payfactors-api';
import { UserResponse } from 'libs/models/payfactors-api/user/response';
import { CompanySetting, CompanyFormData, CompanyDto } from 'libs/models/company';

// Form
export const GET_COMPANY = '[Pf-Admin/Company Page] Get Company';
export const GET_COMPANY_SUCCESS = '[Pf-Admin/Company Page] Get Company Success';
export const GET_COMPANY_ERROR = '[Pf-Admin/Company Page] Get Company Error';
export const GET_SYSTEM_USER_GROUPS = '[Pf-Admin/Company Page] Get System User Groups';
export const GET_SYSTEM_USER_GROUPS_SUCCESS = '[Pf-Admin/Company Page] Get System User Groups Success';
export const GET_SYSTEM_USER_GROUPS_ERROR = '[Pf-Admin/Company Page] Get System User Groups Error';
export const GET_PF_SERVICES_REPS = '[Pf-Admin/Company Page] Get Pf Services Reps';
export const GET_PF_SERVICES_REPS_SUCCESS = '[Pf-Admin/Company Page] Get Pf Services Reps Success';
export const GET_PF_SERVICES_REPS_ERROR = '[Pf-Admin/Company Page] Get Pf Services Reps Error';
export const GET_PF_JDM_SR_ASSOCIATES = '[[Pf-Admin/Company Page] Get Pf JDM Senior Associates';
export const GET_PF_JDM_SR_ASSOCIATES_SUCCESS = '[[Pf-Admin/Company Page] Get Pf JDM Senior Associates Success';
export const GET_PF_JDM_SR_ASSOCIATES_ERROR = '[[Pf-Admin/Company Page] Get Pf JDM Senior Associates Error';
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
export const CHECK_JDM_ENABLED = '[Pf-Admin/Company Page] Check JDM Enabled';
export const LOAD_FORM_DATA = '[Pf-Admin/Company Page] Load Form Data';
export const GET_JOB_PRICING_LIMIT_INFO = '[Pf-Admin/Company Page] Get Job Pricing Limit Info';
export const SET_JOB_PRICING_LIMIT_INFO = '[Pf-Admin/Company Page] Set Job Pricing Limit Info';
export const RESET = '[Pf-Admin/Company Page] Reset';
export const ENABLE_JOB_PRICING_LIMITER = '[Pf-Admin/Company Page] Enable Job Pricing Limiter';

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
export const CHANGE_COMPANY_SETTING_VALUE = '[Pf-Admin/Company Page] Change Company Setting Value';
export const GET_COMPANY_SETTINGS = '[Pf-Admin/Company Page] Get Company Settings';
export const GET_COMPANY_SETTINGS_SUCCESS = '[Pf-Admin/Company Page] Get Company Settings Success';
export const GET_COMPANY_SETTINGS_ERROR = '[Pf-Admin/Company Page] Get Company Settings Error';

// Actions bar
export const CREATE_COMPANY = '[Pf-Admin/Company Page] Create Company';
export const CREATE_COMPANY_SUCCESS = '[Pf-Admin/Company Page] Create Company Success';
export const CREATE_COMPANY_ERROR = '[Pf-Admin/Company Page] Create Company Error';
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
export const SELECT_SMALL_BUSINESS_CLIENT_TYPE = '[Pf-Admin/Company Page] Select Small Business Client Type';

// Disable Tiles
export const DISABLE_PEER_AND_ANALYSIS_TILES = '[Pf-Admin/Company Page] Disable Peer And Analysis Company Tiles';

export class GetCompany implements Action {
  readonly type = GET_COMPANY;

  constructor( public payload: { companyId: number } ) {}
}

export class GetCompanySuccess implements Action {
  readonly type = GET_COMPANY_SUCCESS;

  constructor( public payload: CompanyDto ) {}
}

export class GetCompanyError implements Action {
  readonly type = GET_COMPANY_ERROR;

  constructor() {}
}

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

export class GetPfJdmSrAssociates implements Action {
  readonly type = GET_PF_JDM_SR_ASSOCIATES;

  constructor() {}
}

export class GetPfJdmSrAssociatesSuccess implements Action {
  readonly type = GET_PF_JDM_SR_ASSOCIATES_SUCCESS;

  constructor( public payload: UserResponse[] ) {}
}

export class GetPfJdmSrAssociatesError implements Action {
  readonly type = GET_PF_JDM_SR_ASSOCIATES_ERROR;

  constructor( public payload: UserResponse[] ) {}
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

  constructor( public payload: { companyId: number } ) {}
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

export class CheckJDMEnabled implements Action {
  readonly type = CHECK_JDM_ENABLED;

  constructor( public payload: { companyId: number } ) {}
}

export class LoadFormData implements Action {
  readonly type = LOAD_FORM_DATA;

  constructor( public payload: { companyId: number } ) {}
}

export class GetJobPricingLimitInfo implements Action {
  readonly type = GET_JOB_PRICING_LIMIT_INFO;

  constructor (public payload: { companyId: number}) {}
}

export class SetJobPricingLimitInfo implements Action {
  readonly type = SET_JOB_PRICING_LIMIT_INFO;

  constructor (public payload: any) {}
}

// Tabs
export class GetCompanyTiles implements Action {
  readonly type = GET_COMPANY_TILES;

  constructor( public payload: { companyId: number } ) {}
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

  constructor( public payload: { companyId: number } ) {}
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

export class ChangeCompanySettingValue implements Action {
  readonly type = CHANGE_COMPANY_SETTING_VALUE;

  constructor (public payload: { companySettingKey: string, changedValue: string }) {}
}

export class GetCompanySettings implements Action {
  readonly type = GET_COMPANY_SETTINGS;

  constructor( public payload: { companyId: number } ) {}
}

export class GetCompanySettingsSuccess implements Action {
  readonly type = GET_COMPANY_SETTINGS_SUCCESS;

  constructor( public payload: CompanySetting[] ) {}
}

export class GetCompanySettingsError implements Action {
  readonly type = GET_COMPANY_SETTINGS_ERROR;

  constructor() {}
}

// Actions bar
export class CreateCompany implements Action {
  readonly type = CREATE_COMPANY;

  constructor( public payload: CompanyFormData ) {}
}

export class CreateCompanySuccess implements Action {
  readonly type = CREATE_COMPANY_SUCCESS;

  constructor() {}
}

export class CreateCompanyError implements Action {
  readonly type = CREATE_COMPANY_ERROR;

  constructor() {}
}

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

export class SelectSmallBusinessClientType implements Action {
  readonly type = SELECT_SMALL_BUSINESS_CLIENT_TYPE;

  constructor() {}
}

export class DisablePeerAndAnalysisTiles implements Action {
  readonly type = DISABLE_PEER_AND_ANALYSIS_TILES;

  constructor() {}
}

export class Reset implements Action {
  readonly type = RESET;

  constructor() {}
}

export class EnableJobPricingLimiter implements Action {
  readonly type = ENABLE_JOB_PRICING_LIMITER;

  constructor(public payload: boolean) {}
}

export type Actions
  = GetSystemUserGroups
  | GetSystemUserGroupsSuccess
  | GetSystemUserGroupsError
  | GetPfServicesReps
  | GetPfServicesRepsSuccess
  | GetPfServicesRepsError
  | GetPfJdmSrAssociates
  | GetPfJdmSrAssociatesSuccess
  | GetPfJdmSrAssociatesError
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
  | ChangeCompanySettingValue
  | CreateCompany
  | CreateCompanySuccess
  | CreateCompanyError
  | SaveCompany
  | SaveCompanySuccess
  | SaveCompanyError
  | PutSettings
  | PutSettingsSuccess
  | PutSettingsError
  | SelectPeerClientType
  | SelectPeerAndAnalysisClientType
  | SelectNonPeerClientType
  | SelectSmallBusinessClientType
  | GetCompany
  | GetCompanySuccess
  | GetCompanyError
  | GetCompanySettings
  | GetCompanySettingsSuccess
  | GetCompanySettingsError
  | CheckJDMEnabled
  | LoadFormData
  | GetJobPricingLimitInfo
  | SetJobPricingLimitInfo
  | DisablePeerAndAnalysisTiles
  | Reset
  | EnableJobPricingLimiter;

