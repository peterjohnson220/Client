import * as cloneDeep from 'lodash.clonedeep';

import { SystemUserGroupsResponse, CompanyIndustriesResponse, CompanyTilesResponse,
  CompanyDataSetsReponse, CompanyClientTypesReponse, ListCompositeFields } from 'libs/models/payfactors-api';
import { SortDirection, arraySortByString } from 'libs/core/functions';
import { UserResponse } from 'libs/models/payfactors-api/user/response';
import { CompanySetting } from 'libs/models/company';

import * as fromCompanyPageActions from '../actions/company-page.actions';

export interface State {
  loadingPublicTokenUrl: boolean;
  loadingPublicTokenUrlError: boolean;
  loadingSystemUserGroups: boolean;
  loadingPfServicesReps: boolean;
  loadingPfCustomerSuccessManagers: boolean;
  loadingCompanyIndustries: boolean;
  loadingCompanyTiles: boolean;
  loadingCompanyTilesError: boolean;
  loadingCompanySettings: boolean;
  loadingCompanySettingsError: boolean;
  loadingCompanyDataSets: boolean;
  loadingCompanyDataSetsError: boolean;
  loadingCompanyClientTypes: boolean;
  loadingCompositeFields: boolean;
  savingCompany: boolean;
  savingCompanyError: boolean;
  tokenUrl: string;
  pfCustomerSuccessManagers: UserResponse[];
  pfServicesReps: UserResponse[];
  systemUserGroups: SystemUserGroupsResponse[];
  companyIndustries: CompanyIndustriesResponse[];
  companyTiles: CompanyTilesResponse[];
  companySettings: CompanySetting[];
  companyDataSets: CompanyDataSetsReponse[];
  companyClientTypes: CompanyClientTypesReponse[];
  compositeFields: ListCompositeFields[];
}

const initialState: State = {
  loadingPublicTokenUrl: false,
  loadingPublicTokenUrlError: false,
  loadingSystemUserGroups: false,
  loadingPfServicesReps: false,
  loadingPfCustomerSuccessManagers: false,
  loadingCompanyIndustries: false,
  loadingCompanyTiles: false,
  loadingCompanyTilesError: false,
  loadingCompanySettings: false,
  loadingCompanySettingsError: false,
  loadingCompanyDataSets: false,
  loadingCompanyDataSetsError: false,
  loadingCompanyClientTypes: false,
  loadingCompositeFields: false,
  savingCompany: false,
  savingCompanyError: false,
  tokenUrl: '',
  pfCustomerSuccessManagers: [],
  pfServicesReps: [],
  systemUserGroups: [],
  companyIndustries: [],
  companyTiles: [],
  companySettings: [],
  companyDataSets: [],
  companyClientTypes: [],
  compositeFields: []
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
        loadingCompanyTiles: true
      };
    }
    case fromCompanyPageActions.GET_COMPANY_TILES_SUCCESS: {
      return {
        ...state,
        loadingCompanyTiles: false,
        companyTiles: action.payload
      };
    }
    case fromCompanyPageActions.GET_COMPANY_TILES_ERROR: {
      return {
        ...state,
        loadingCompanyTiles: false,
        loadingCompanyTilesError: true
      };
    }
    case fromCompanyPageActions.GET_DEFAULT_SETTINGS: {
      return {
        ...state,
        loadingCompanySettings: true
      };
    }
    case fromCompanyPageActions.GET_DEFAULT_SETTINGS_SUCCESS: {
      return {
        ...state,
        loadingCompanySettings: false,
        companySettings: action.payload
      };
    }
    case fromCompanyPageActions.GET_DEFAULT_SETTINGS_ERROR: {
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
      const companySettingsCopy =  cloneDeep(state.companySettings);
      const companySetting: CompanySetting = companySettingsCopy.find((x: CompanySetting) => x.Key === selectedCompanySetting.Key);
      if (companySetting) {
        companySetting.Value = companySetting.Value === 'true' ? 'false' : 'true';
      }
      return {
        ...state,
        companySettings: companySettingsCopy
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
export const getPfServicesReps = (state: State) => state.pfServicesReps;
export const getLoadingPfCustomerSuccessManagers = (state: State) => state.loadingPfCustomerSuccessManagers;
export const getPfCustomerSuccessManagers = (state: State) => state.pfCustomerSuccessManagers;
export const getLoadingCompanyIndustries = (state: State) => state.loadingCompanyIndustries;
export const getCompanyIndustries = (state: State) => state.companyIndustries;
export const getLoadingCompanyTiles = (state: State) => state.loadingCompanyTiles;
export const getLoadingCompanyTilesError = (state: State) => state.loadingCompanyTilesError;
export const getCompanyTiles = (state: State) => state.companyTiles;
export const getLoadingCompanySettings = (state: State) => state.loadingCompanySettings;
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
