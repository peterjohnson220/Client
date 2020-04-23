import * as cloneDeep from 'lodash.clonedeep';

import { SystemUserGroupsResponse, CompanyIndustriesResponse, CompanyTilesResponse,
  CompanyDataSetsReponse, CompanyClientTypesReponse, ListCompositeFields } from 'libs/models/payfactors-api';
import { SortDirection, arraySortByString } from 'libs/core/functions';
import { UserResponse } from 'libs/models/payfactors-api/user/response';
import { CompanySetting, CompanyDto, CompanySettingsEnum } from 'libs/models/company';
import { SystemUserGroupNames, TileNames } from 'libs/constants';
import * as fromCompanyPageActions from '../actions/company-page.actions';
import { CompanyPageHelper } from '../helpers';

export interface State {
  loadingPublicTokenUrl: boolean;
  loadingPublicTokenUrlError: boolean;
  loadingSystemUserGroups: boolean;
  loadingPfAccountExecutives: boolean;
  loadingPfServicesReps: boolean;
  loadingPfJdmSrAssociates: boolean;
  loadingPfCustomerSuccessManagers: boolean;
  loadingCompanyIndustries: boolean;
  loadingCompanyTiles: boolean;
  loadingCompanyTilesSuccess: boolean;
  loadingCompanyTilesError: boolean;
  loadingCompanySettings: boolean;
  loadingCompanySettingsSuccess: boolean;
  loadingCompanySettingsError: boolean;
  loadingCompanyDataSets: boolean;
  loadingCompanyDataSetsError: boolean;
  loadingCompanyClientTypes: boolean;
  loadingCompositeFields: boolean;
  loadingCompany: boolean;
  savingCompany: boolean;
  savingCompanyError: boolean;
  tokenUrl: string;
  companyDataSetsEnabled: boolean;
  pfAccountExecutives: UserResponse[];
  pfCustomerSuccessManagers: UserResponse[];
  pfServicesReps: UserResponse[];
  pfJdmSrAssociates: UserResponse[];
  systemUserGroups: SystemUserGroupsResponse[];
  companyIndustries: CompanyIndustriesResponse[];
  companyTiles: CompanyTilesResponse[];
  companySettings: CompanySetting[];
  companyDataSets: CompanyDataSetsReponse[];
  companyClientTypes: CompanyClientTypesReponse[];
  compositeFields: ListCompositeFields[];
  initialCompanyTiles: CompanyTilesResponse[];
  initialCompanySettings: CompanySetting[];
  company: CompanyDto;
  peerTermsAndCondAccepted: boolean;
  jobPricingLimitInfo: any;
  enableJobPricingLimiter: boolean;
}

const initialState: State = {
  loadingPublicTokenUrl: false,
  loadingPublicTokenUrlError: false,
  loadingSystemUserGroups: false,
  loadingPfAccountExecutives: false,
  loadingPfServicesReps: false,
  loadingPfJdmSrAssociates: false,
  loadingPfCustomerSuccessManagers: false,
  loadingCompanyIndustries: false,
  loadingCompanyTiles: false,
  loadingCompanyTilesSuccess: false,
  loadingCompanyTilesError: false,
  loadingCompanySettings: false,
  loadingCompanySettingsSuccess: false,
  loadingCompanySettingsError: false,
  loadingCompanyDataSets: false,
  loadingCompanyDataSetsError: false,
  loadingCompanyClientTypes: false,
  loadingCompositeFields: false,
  loadingCompany: false,
  savingCompany: false,
  savingCompanyError: false,
  tokenUrl: '',
  companyDataSetsEnabled: true,
  pfAccountExecutives: [],
  pfCustomerSuccessManagers: [],
  pfServicesReps: [],
  pfJdmSrAssociates: [],
  systemUserGroups: [],
  companyIndustries: [],
  companyTiles: [],
  companySettings: [],
  companyDataSets: [],
  companyClientTypes: [],
  compositeFields: [],
  initialCompanyTiles: [],
  initialCompanySettings: [],
  company: null,
  peerTermsAndCondAccepted: false,
  jobPricingLimitInfo: null,
  enableJobPricingLimiter: false
};

export function reducer(state = initialState, action: fromCompanyPageActions.Actions) {
  switch (action.type) {
    case fromCompanyPageActions.GET_SYSTEM_USER_GROUPS: {
      return {
        ...state,
        loadingSystemUserGroups: true
      };
    }
    case fromCompanyPageActions.GET_SYSTEM_USER_GROUPS_SUCCESS: {
      const results = cloneDeep(action.payload)
        .sort((a: SystemUserGroupsResponse, b: SystemUserGroupsResponse) =>
          arraySortByString(a.DisplayName, b.DisplayName, SortDirection.Ascending));
      return {
        ...state,
        loadingSystemUserGroups: false,
        systemUserGroups: results
      };
    }
    case fromCompanyPageActions.GET_SYSTEM_USER_GROUPS_ERROR: {
      return {
        ...state,
        loadingSystemUserGroups: false
      };
    }
    case fromCompanyPageActions.GET_PF_ACCOUNT_EXECUTIVES: {
      return {
        ...state,
        loadingPfAccountExecutives: true
      };
    }
    case fromCompanyPageActions.GET_PF_ACCOUNT_EXECUTIVES_SUCCESS: {
      const results = cloneDeep(action.payload)
        .sort((a: UserResponse, b: UserResponse) =>
          arraySortByString(a.FirstName, b.FirstName, SortDirection.Ascending));
      return {
        ...state,
        loadingPfAccountExecutives: false,
        pfAccountExecutives: results
      };
    }
    case fromCompanyPageActions.GET_PF_SERVICES_REPS: {
      return {
        ...state,
        loadingPfServicesReps: true
      };
    }
    case fromCompanyPageActions.GET_PF_SERVICES_REPS_SUCCESS: {
      const results = cloneDeep(action.payload)
        .sort((a: UserResponse, b: UserResponse) =>
          arraySortByString(a.FirstName, b.FirstName, SortDirection.Ascending));
      return {
        ...state,
        loadingPfServicesReps: false,
        pfServicesReps: results
      };
    }
    case fromCompanyPageActions.GET_PF_SERVICES_REPS_ERROR: {
      return {
        ...state,
        loadingPfServicesReps: false
      };
    }
    case fromCompanyPageActions.GET_PF_JDM_SR_ASSOCIATES: {
      return {
        ...state,
        loadingPfJdmSrAssociates: true
      };
    }
    case fromCompanyPageActions.GET_PF_JDM_SR_ASSOCIATES_SUCCESS: {
      const results = cloneDeep(action.payload)
        .sort((a: UserResponse, b: UserResponse) =>
          arraySortByString(a.FirstName, b.FirstName, SortDirection.Ascending));
      return {
        ...state,
        loadingPfJdmSrAssociates: false,
        pfJdmSrAssociates: results
      };
    }
    case fromCompanyPageActions.GET_PF_JDM_SR_ASSOCIATES_ERROR: {
      return {
        ...state,
        loadingPfJdmSrAssociates: false
      };
    }
    case fromCompanyPageActions.GET_PF_CUSTOMER_SUCCESS_MANAGERS: {
      return {
        ...state,
        loadingPfCustomerSuccessManagers: true
      };
    }
    case fromCompanyPageActions.GET_PF_CUSTOMER_SUCCESS_MANAGERS_SUCCESS: {
      const results = cloneDeep(action.payload)
        .sort((a: UserResponse, b: UserResponse) =>
          arraySortByString(a.FirstName, b.FirstName, SortDirection.Ascending));
      return {
        ...state,
        loadingPfCustomerSuccessManagers: false,
        pfCustomerSuccessManagers: results
      };
    }
    case fromCompanyPageActions.GET_PF_CUSTOMER_SUCCESS_MANAGERS_ERROR: {
      return {
        ...state,
        loadingPfCustomerSuccessManagers: false
      };
    }
    case fromCompanyPageActions.GET_COMPANY_INDUSTRIES: {
      return {
        ...state,
        loadingCompanyIndustries: true
      };
    }
    case fromCompanyPageActions.GET_COMPANY_INDUSTRIES_SUCCESS: {
      return {
        ...state,
        loadingCompanyIndustries: false,
        companyIndustries: action.payload
      };
    }
    case fromCompanyPageActions.GET_COMPANY_INDUSTRIES_ERROR: {
      return {
        ...state,
        loadingCompanyIndustries: false
      };
    }
    case fromCompanyPageActions.GET_PUBLIC_TOKEN_URL: {
      return {
        ...state,
        loadingPublicTokenUrl: true
      };
    }
    case fromCompanyPageActions.GET_PUBLIC_TOKEN_URL_SUCCESS: {
      return {
        ...state,
        loadingPublicTokenUrl: false,
        tokenUrl: action.payload
      };
    }
    case fromCompanyPageActions.GET_PUBLIC_TOKEN_URL_ERROR: {
      return {
        ...state,
        loadingPublicTokenUrl: false,
        loadingPublicTokenUrlError: true
      };
    }
    case fromCompanyPageActions.GET_COMPANY_CLIENT_TYPES: {
      return {
        ...state,
        loadingCompanyClientTypes: true
      };
    }
    case fromCompanyPageActions.GET_COMPANY_CLIENT_TYPES_SUCCESS: {
      return {
        ...state,
        loadingCompanyClientTypes: false,
        companyClientTypes: action.payload
      };
    }
    case fromCompanyPageActions.GET_COMPANY_CLIENT_TYPES_ERROR: {
      return {
        ...state,
        loadingCompanyClientTypes: false
      };
    }
    case fromCompanyPageActions.GET_COMPANY_TILES: {
      return {
        ...state,
        loadingCompanyTiles: true,
        loadingCompanyTilesSuccess: false,
        loadingCompanyTilesError: false,
        tokenUrl: ''
      };
    }
    case fromCompanyPageActions.GET_COMPANY_TILES_SUCCESS: {
      const companyTiles = action.payload.map(c => {
        if ( c.TileName === TileNames.InternationalData) {
          return {...c, Checked: false};
        } else {
          return {...c};
        }
      });

      return {
        ...state,
        loadingCompanyTiles: false,
        loadingCompanyTilesSuccess: true,
        companyTiles: companyTiles,
        initialCompanyTiles: companyTiles
      };
    }
    case fromCompanyPageActions.GET_COMPANY_TILES_ERROR: {
      return {
        ...state,
        loadingCompanyTiles: false,
        loadingCompanyTilesError: true
      };
    }
    case fromCompanyPageActions.GET_DEFAULT_SETTINGS:
    case fromCompanyPageActions.GET_COMPANY_SETTINGS: {
      return {
        ...state,
        loadingCompanySettings: true,
        loadingCompanySettingsSuccess: false,
        loadingCompanySettingsError: false
      };
    }
    case fromCompanyPageActions.GET_DEFAULT_SETTINGS_SUCCESS: {
      return {
        ...state,
        loadingCompanySettings: false,
        loadingCompanySettingsSuccess: true,
        companySettings: cloneDeep(action.payload)
      };
    }
    case fromCompanyPageActions.GET_COMPANY_SETTINGS_SUCCESS: {
      let settings = cloneDeep(action.payload);
      const peerTermsAndCondAccepted = settings.some((x: CompanySetting) =>
        x.Key === CompanySettingsEnum.PeerTermsAndConditionsAccepted && x.Value.toLowerCase() === 'true');

      if (peerTermsAndCondAccepted) {
        settings = CompanyPageHelper.modifyPeerTCRequestSettingDisabled(settings);
      }

      return {
        ...state,
        loadingCompanySettings: false,
        loadingCompanySettingsSuccess: true,
        companySettings: settings,
        initialCompanySettings: settings,
        peerTermsAndCondAccepted: peerTermsAndCondAccepted
      };
    }
    case fromCompanyPageActions.GET_DEFAULT_SETTINGS_ERROR:
    case fromCompanyPageActions.GET_COMPANY_SETTINGS_ERROR: {
      return {
        ...state,
        loadingCompanySettings: false,
        loadingCompanySettingsError: true
      };
    }
    case fromCompanyPageActions.GET_COMPANY_DATA_SETS: {
      return {
        ...state,
        loadingCompanyDataSets: true
      };
    }
    case fromCompanyPageActions.GET_COMPANY_DATA_SETS_SUCCESS: {
      return {
        ...state,
        loadingCompanyDataSets: false,
        companyDataSets: action.payload
      };
    }
    case fromCompanyPageActions.GET_COMPANY_DATA_SETS_ERROR: {
      return {
        ...state,
        loadingCompanyDataSets: false,
        loadingCompanyDataSetsError: true
      };
    }
    case fromCompanyPageActions.GET_COMPOSITE_FIELDS: {
      return {
        ...state,
        loadingCompositeFields: true
      };
    }
    case fromCompanyPageActions.GET_COMPOSITE_FIELDS_SUCCESS: {
      return {
        ...state,
        loadingCompositeFields: false,
        compositeFields: action.payload
      };
    }
    case fromCompanyPageActions.GET_COMPOSITE_FIELDS_ERROR: {
      return {
        ...state,
        loadingCompositeFields: false
      };
    }
    case fromCompanyPageActions.CREATE_COMPANY: {
      return {
        ...state,
        savingCompany: true
      };
    }
    case fromCompanyPageActions.CREATE_COMPANY_SUCCESS: {
      return {
        ...state,
        savingCompany: false
      };
    }
    case fromCompanyPageActions.CREATE_COMPANY_ERROR: {
      return {
        ...state,
        savingCompany: false,
        savingCompanyError: true
      };
    }
    case fromCompanyPageActions.SAVE_COMPANY: {
      return {
        ...state,
        savingCompany: true
      };
    }
    case fromCompanyPageActions.SAVE_COMPANY_SUCCESS: {
      return {
        ...state,
        savingCompany: false
      };
    }
    case fromCompanyPageActions.SAVE_COMPANY_ERROR: {
      return {
        ...state,
        savingCompany: false,
        savingCompanyError: true
      };
    }
    case fromCompanyPageActions.TOGGLE_COMPANY_TILE: {
    const selectedCompanyTile = action.payload;
    const companyTilesCopy =  cloneDeep(state.companyTiles);
    const companyTile = companyTilesCopy.find((t: CompanyTilesResponse) => t.TileId === selectedCompanyTile.TileId);
    if (companyTile) {
      companyTile.Checked = !companyTile.Checked;
      companyTile.MarketingEnabled = false;
    }
    return {
      ...state,
      companyTiles: companyTilesCopy
    };
  }
    case fromCompanyPageActions.TOGGLE_COMPANY_MARKETING_TILE: {
      const selectedCompanyTile = action.payload;
      const companyTilesCopy =  cloneDeep(state.companyTiles);
      const companyTile = companyTilesCopy.find((t: CompanyTilesResponse) => t.TileId === selectedCompanyTile.TileId);
      if (companyTile) {
        companyTile.MarketingEnabled = !companyTile.MarketingEnabled;
      }
      return {
        ...state,
        companyTiles: companyTilesCopy
      };
    }
    case fromCompanyPageActions.TOGGLE_COMPANY_DATA_SET: {
      const selectedDataSet = action.payload;
      const dataSetsCopy =  cloneDeep(state.companyDataSets);
      const companyDataSet = dataSetsCopy.find((x: CompanyDataSetsReponse) => x.CountryCode === selectedDataSet.CountryCode);
      if (companyDataSet) {
        companyDataSet.Checked = !companyDataSet.Checked;
      }
      return {
        ...state,
        companyDataSets: dataSetsCopy
      };
    }
    case fromCompanyPageActions.TOGGLE_COMPANY_SETTING: {
      const selectedCompanySetting = action.payload;
      let companySettingsCopy =  cloneDeep(state.companySettings);
      const companySetting: CompanySetting = companySettingsCopy.find((x: CompanySetting) => x.Key === selectedCompanySetting.Key);
      if (companySetting) {
        companySetting.Value = companySetting.Value === 'true' ? 'false' : 'true';
        if ((companySetting.Key === CompanySettingsEnum.PeerTermsAndConditionsRequested ||
          companySetting.Key === CompanySettingsEnum.PeerTermsAndConditionsHardCopyRequested) &&
          companySetting.Value === 'true') {
          companySettingsCopy = CompanyPageHelper.modifyPeerTCRequestSettingValue(companySetting, companySettingsCopy);
        }
      }
      return {
        ...state,
        companySettings: companySettingsCopy
      };
    }
    case fromCompanyPageActions.CHANGE_COMPANY_SETTING_VALUE: {
      const companySettingsCopy =  cloneDeep(state.companySettings);
      const companySetting: CompanySetting = companySettingsCopy.find((x: CompanySetting) => x.Key === action.payload.companySettingKey);
      if (companySetting) {
        companySetting.Value = action.payload.changedValue;
      }
      return {
        ...state,
        companySettings: companySettingsCopy
      };
    }
    case fromCompanyPageActions.SELECT_PEER_CLIENT_TYPE: {
      let companyTilesCopy = cloneDeep(state.companyTiles);
      companyTilesCopy = CompanyPageHelper.getPeerClientTypeCompanyTiles(companyTilesCopy);
      let companySettingsCopy = cloneDeep(state.companySettings);
      companySettingsCopy = CompanyPageHelper.getPeerClientTypeCompanySettings(companySettingsCopy);
      return {
        ...state,
        companyTiles: companyTilesCopy,
        companySettings: companySettingsCopy,
        companyDataSetsEnabled: false
      };
    }
    case fromCompanyPageActions.SELECT_PEER_AND_ANALYSIS_CLIENT_TYPE: {
      let companyTilesCopy = cloneDeep(state.companyTiles);
      companyTilesCopy = CompanyPageHelper.getPeerAndAnalysisClientTypeCompanyTiles(companyTilesCopy);
      let companySettingsCopy = cloneDeep(state.companySettings);
      companySettingsCopy = CompanyPageHelper.getPeerAndAnalysisClientTypeCompanySettings(companySettingsCopy);
      return {
        ...state,
        companyTiles: companyTilesCopy,
        companySettings: companySettingsCopy,
        companyDataSetsEnabled: false
      };
    }
    case fromCompanyPageActions.SELECT_NON_PEER_CLIENT_TYPE: {
      let companyTilesCopy = cloneDeep(state.initialCompanyTiles);
      if (!state.peerTermsAndCondAccepted) {
        companyTilesCopy = CompanyPageHelper.getNonPeerClientTypeCompanyTiles(companyTilesCopy);
      }
      return {
        ...state,
        companyTiles: companyTilesCopy,
        companyDataSetsEnabled: true
      };
    }
    case fromCompanyPageActions.DISABLE_PEER_AND_ANALYSIS_TILES: {
      let companyTilesCopy = cloneDeep(state.companyTiles);
      companyTilesCopy = CompanyPageHelper.disablePeerAndAnalysisCompanyTiles(companyTilesCopy);
      return {
        ...state,
        companyTiles: companyTilesCopy,
        companyDataSetsEnabled: false
      };
    }
    case fromCompanyPageActions.GET_COMPANY: {
      return {
        ...state,
        loadingCompany: true
      };
    }
    case fromCompanyPageActions.GET_COMPANY_SUCCESS: {
      return {
        ...state,
        loadingCompany: false,
        company: action.payload,
        enableJobPricingLimiter: action.payload.GroupName === SystemUserGroupNames.SmallBusiness
      };
    }
    case fromCompanyPageActions.GET_COMPANY_ERROR: {
      return {
        ...state,
        loadingCompany: false
      };
    }
    case fromCompanyPageActions.SET_JOB_PRICING_LIMIT_INFO: {
      return {
        ...state,
        jobPricingLimitInfo: action.payload
      };
    }
    case fromCompanyPageActions.RESET: {
      return {
        ...initialState
      };
    }
    case fromCompanyPageActions.ENABLE_JOB_PRICING_LIMITER: {
      return {
        ...state,
        enableJobPricingLimiter: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoadingPublicTokenUrl = (state: State) => state.loadingPublicTokenUrl;
export const getLoadingPublicTokenUrlError = (state: State) => state.loadingPublicTokenUrlError;
export const getTokenUrl = (state: State) => state.tokenUrl;
export const getLoadingSystemUserGroups = (state: State) => state.loadingSystemUserGroups;
export const getSystemUserGroups = (state: State) => state.systemUserGroups;
export const getLoadingPfServicesReps = (state: State) => state.loadingPfServicesReps;
export const getPfAccountExecutives = (state: State) => state.pfAccountExecutives;
export const getPfServicesReps = (state: State) => state.pfServicesReps;
export const getLoadingPfJdmSrAssociates = (state: State) => state.loadingPfJdmSrAssociates;
export const getPfJdmSrAssociates = (state: State) => state.pfJdmSrAssociates;
export const getLoadingPfCustomerSuccessManagers = (state: State) => state.loadingPfCustomerSuccessManagers;
export const getPfCustomerSuccessManagers = (state: State) => state.pfCustomerSuccessManagers;
export const getLoadingCompanyIndustries = (state: State) => state.loadingCompanyIndustries;
export const getCompanyIndustries = (state: State) => state.companyIndustries;
export const getLoadingCompanyTiles = (state: State) => state.loadingCompanyTiles;
export const getLoadingCompanyTilesSuccess = (state: State) => state.loadingCompanyTilesSuccess;
export const getLoadingCompanyTilesError = (state: State) => state.loadingCompanyTilesError;
export const getCompanyTiles = (state: State) => state.companyTiles;
export const getLoadingCompanySettings = (state: State) => state.loadingCompanySettings;
export const getLoadingCompanySettingsSuccess = (state: State) => state.loadingCompanySettingsSuccess;
export const getLoadingCompanySettingsError = (state: State) => state.loadingCompanySettingsError;
export const getCompanySettings = (state: State) => state.companySettings;
export const getLoadingCompanyDataSets = (state: State) => state.loadingCompanyDataSets;
export const getLoadingCompanyDataSetsError = (state: State) => state.loadingCompanyDataSetsError;
export const getCompanyDataSets = (state: State) => state.companyDataSets;
export const getLoadingCompanyClientTypes = (state: State) => state.loadingCompanyClientTypes;
export const getCompanyClientTypes = (state: State) => state.companyClientTypes;
export const getLoadingCompositeFields = (state: State) => state.loadingCompositeFields;
export const getCompositeFields = (state: State) => state.compositeFields;
export const getSavingCompany = (state: State) => state.savingCompany;
export const getSavingCompanyError = (state: State) => state.savingCompanyError;
export const getCompanyDataSetsEnabled = (state: State) => state.companyDataSetsEnabled;
export const getLoadingCompany = (state: State) => state.loadingCompany;
export const getCompany = (state: State) => state.company;
export const getJobPricingLimitInfo = (state: State) => state.jobPricingLimitInfo;
export const getEnableJobPricingLimiter = (state: State) => state.enableJobPricingLimiter;
