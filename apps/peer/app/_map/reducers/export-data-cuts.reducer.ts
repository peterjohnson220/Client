import { Currency } from 'libs/models/common';

import * as fromExportDataCutsActions from '../actions/export-data-cuts.actions';

export interface State {
  exporting: boolean;
  exportingError: boolean;
  exportDataCutsModalOpen: boolean;
  currencies: Currency[];
}

// Initial State
export const initialState: State = {
  exporting: false,
  exportingError: false,
  exportDataCutsModalOpen: false,
  currencies: []
};

// Reducer
export function reducer(
  state = initialState,
  action: fromExportDataCutsActions.Actions
): State {
  switch (action.type) {
    case fromExportDataCutsActions.EXPORT_DATA_CUTS: {
      return {
        ...state,
        exporting: true,
        exportingError: false
      };
    }
    case fromExportDataCutsActions.EXPORT_DATA_CUTS_SUCCESS: {
      return {
        ...state,
        exporting: false,
        exportingError: false,
        exportDataCutsModalOpen: false
      };
    }
    case fromExportDataCutsActions.EXPORT_DATA_CUTS_ERROR: {
      return {
        ...state,
        exporting: false,
        exportingError: true
      };
    }
    case fromExportDataCutsActions.OPEN_EXPORT_DATA_CUTS_MODAL: {
      return {
        ...state,
        exportDataCutsModalOpen: true
      };
    }
    case fromExportDataCutsActions.CLOSE_EXPORT_DATA_CUTS_MODAL: {
      return {
        ...state,
        exportDataCutsModalOpen: false
      };
    }
    case fromExportDataCutsActions.LOAD_CURRENCIES_SUCCESS: {
      return {
        ...state,
        currencies: action.payload.currencies
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getExporting = (state: State) => state.exporting;
export const getExportingError = (state: State) => state.exportingError;
export const getExportDataCutsModalOpen = (state: State) => state.exportDataCutsModalOpen;
export const getCurrencies = (state: State) => state.currencies;
