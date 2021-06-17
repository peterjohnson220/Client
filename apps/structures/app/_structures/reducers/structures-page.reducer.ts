import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { KendoTypedDropDownItem } from 'libs/models/kendo';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { GroupedListItem } from 'libs/models/list';
import { arraySortByString, SortDirection } from 'libs/core/functions';
import { PfDataGridCustomFilterOptions } from 'libs/features/grids/pf-data-grid/models';

// Import all exports from our feature's actions
import * as fromStructuresPageActions from '../actions/structures-page.actions';

// Define our feature state
export interface State {
  deleteStructuresModalOpen: boolean;
  deletingStructureError: boolean;
  deletingStructure: boolean;
  currencies: AsyncStateObj<KendoTypedDropDownItem[]>;
  companyPayMarkets: AsyncStateObj<GroupedListItem[]>;
  customFilterOptions: PfDataGridCustomFilterOptions[];
}

// Define our initial state
const initialState: State = {
  deleteStructuresModalOpen: false,
  deletingStructureError: false,
  deletingStructure: false,
  currencies: generateDefaultAsyncStateObj<KendoTypedDropDownItem[]>([]),
  companyPayMarkets: generateDefaultAsyncStateObj<GroupedListItem[]>([]),
  customFilterOptions: [
    {
      EntitySourceName: 'CompanyStructures_RangeGroup',
      SourceName: 'Currency',
      FilterDisplayOptions: []
    }
  ]
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
      const companyPayMarkets = action.payload.map(o => ({ Name: o.PayMarket, Value: o.PayMarket }))
        .sort((a, b) => arraySortByString(a.Name, b.Name, SortDirection.Ascending));
      return AsyncStateObjHelper.loadingSuccess(state, 'companyPayMarkets', companyPayMarkets);
    case fromStructuresPageActions.LOAD_COMPANY_PAYMARKETS_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'companyPayMarkets');
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
