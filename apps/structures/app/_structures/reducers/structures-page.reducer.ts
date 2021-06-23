import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { KendoTypedDropDownItem } from 'libs/models/kendo';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { PfDataGridCustomFilterOptions } from 'libs/features/grids/pf-data-grid/models';
import { CompanyStructure, PayMarket } from 'libs/models';
import { RangeDistributionType } from 'libs/models/payfactors-api';

// Import all exports from our feature's actions
import * as fromStructuresPageActions from '../actions/structures-page.actions';

// Define our feature state
export interface State {
  deleteStructuresModalOpen: boolean;
  deletingStructureError: boolean;
  deletingStructure: boolean;
  currencies: AsyncStateObj<KendoTypedDropDownItem[]>;
  companyPayMarkets: AsyncStateObj<PayMarket[]>;
  customFilterOptions: PfDataGridCustomFilterOptions[];
  showStructureForm: boolean;
  savingStructure: boolean;
  savingStructureErrorMessage: string;
  structures: AsyncStateObj<CompanyStructure[]>;
  rangeDistributionTypes: AsyncStateObj<RangeDistributionType[]>;
}

// Define our initial state
const initialState: State = {
  deleteStructuresModalOpen: false,
  deletingStructureError: false,
  deletingStructure: false,
  currencies: generateDefaultAsyncStateObj<KendoTypedDropDownItem[]>([]),
  companyPayMarkets: generateDefaultAsyncStateObj<PayMarket[]>([]),
  customFilterOptions: [
    {
      EntitySourceName: 'CompanyStructures_RangeGroup',
      SourceName: 'Currency',
      FilterDisplayOptions: []
    }
  ],
  showStructureForm: false,
  savingStructure: false,
  savingStructureErrorMessage: null,
  structures: generateDefaultAsyncStateObj<CompanyStructure[]>([]),
  rangeDistributionTypes: generateDefaultAsyncStateObj<RangeDistributionType[]>([])
};


// Reducer function
export function reducer(state = initialState, action: fromStructuresPageActions.Actions): State {
  switch (action.type) {
    case fromStructuresPageActions.CLOSE_DELETE_STRUCTURES_MODAL: {
      return {
        ...state,
        deleteStructuresModalOpen: false
      };
    }
    case fromStructuresPageActions.OPEN_DELETE_STRUCTURES_MODAL: {
      return {
        ...state,
        deleteStructuresModalOpen: true
      };
    }
    case fromStructuresPageActions.DELETE_STRUCTURE_MODEL: {
      return {
        ...state,
        deletingStructure: true,
        deletingStructureError: false
      };
    }
    case fromStructuresPageActions.DELETE_STRUCTURE_MODEL_ERROR: {
      return {
        ...state,
        deletingStructure: false,
        deletingStructureError: true
      };
    }
    case fromStructuresPageActions.DELETE_STRUCTURE_MODEL_SUCCESS: {
      return {
        ...state,
        deletingStructure: false,
        deletingStructureError: false
      };
    }
    case fromStructuresPageActions.LOAD_CURRENCIES:
      return AsyncStateObjHelper.loading(state, 'currencies');
    case fromStructuresPageActions.LOAD_CURRENCIES_SUCCESS: {
      const customFilterOptionsClone: PfDataGridCustomFilterOptions[] = cloneDeep(state.customFilterOptions);

      customFilterOptionsClone.find(x => x.SourceName === 'Currency').FilterDisplayOptions = action.payload.map(function (x) {
        return {Display: x.Name, Value: x.Value};
      });
      return {
        ...state,
        customFilterOptions: customFilterOptionsClone,
        currencies: { ...state['currencies'], loading: false, obj: action.payload }
      };
    }
    case fromStructuresPageActions.LOAD_CURRENCIES_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'currencies');
    case fromStructuresPageActions.LOAD_COMPANY_PAYMARKETS:
      return AsyncStateObjHelper.loading(state, 'companyPayMarkets');
    case fromStructuresPageActions.LOAD_COMPANY_PAYMARKETS_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'companyPayMarkets', action.payload);
    case fromStructuresPageActions.LOAD_COMPANY_PAYMARKETS_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'companyPayMarkets');
    case fromStructuresPageActions.LOAD_COMPANY_STRUCTURES: {
      return AsyncStateObjHelper.loading(state, 'structures');
    }
    case fromStructuresPageActions.LOAD_COMPANY_STRUCTURES_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'structures', action.payload);
    }
    case fromStructuresPageActions.LOAD_COMPANY_STRUCTURES_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'structures');
    }
    case fromStructuresPageActions.LOAD_RANGE_DISTRIBUTION_TYPES: {
      return AsyncStateObjHelper.loading(state, 'rangeDistributionTypes');
    }
    case fromStructuresPageActions.LOAD_RANGE_DISTRIBUTION_TYPES_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'rangeDistributionTypes', action.payload);
    }
    case fromStructuresPageActions.LOAD_RANGE_DISTRIBUTION_TYPES_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'rangeDistributionTypes');
    }
    case fromStructuresPageActions.SHOW_STRUCTURE_FORM: {
      return {
        ...state,
        showStructureForm: action.showStructureForm,
        savingStructureErrorMessage: null
      };
    }
    case fromStructuresPageActions.CREATE_STRUCTURE: {
      return {
        ...state,
        savingStructure: true,
        savingStructureErrorMessage: null
      };
    }
    case fromStructuresPageActions.CREATE_STRUCTURE_SUCCESS: {
      return {
        ...state,
        savingStructure: false
      };
    }
    case fromStructuresPageActions.CREATE_STRUCTURE_ERROR: {
      return {
        ...state,
        savingStructure: false,
        savingStructureErrorMessage: action.payload.errorMessage
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getDeleteStructuresModalOpen = (state: State) => state.deleteStructuresModalOpen;
export const getDeletingStructureStatus = (state: State) => state.deletingStructure;
export const getDeletingStructureErrorStatus = (state: State) => state.deletingStructureError;
export const getCurrencies = (state: State) => state.currencies;
export const getCompanyPayMarkets = (state: State) => state.companyPayMarkets;
export const getCustomFilterOptions = (state: State) => state.customFilterOptions;
export const getShowStructureForm = (state: State) => state.showStructureForm;
export const getSavingStructure = (state: State) => state.savingStructure;
export const getSavingStructureErrorMessage = (state: State) => state.savingStructureErrorMessage;
export const getCompanyStructures = (state: State) => state.structures;
export const getRangeDistributionTypes = (state: State) => state.rangeDistributionTypes;
