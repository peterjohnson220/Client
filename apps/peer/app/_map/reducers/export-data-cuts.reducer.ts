import * as fromExportDataCutsActions from '../actions/export-data-cuts.actions';

export interface State {
  exporting: boolean;
  exportingError: boolean;
  exportDataCutsModalOpen: boolean;
}

// Initial State
export const initialState: State = {
  exporting: false,
  exportingError: false,
  exportDataCutsModalOpen: false
};

// Reducer
export function reducer(
  state = initialState,
  action: fromExportDataCutsActions.Actions
): State {
  switch (action.type) {
    case fromExportDataCutsActions.EXPORT_DATA_CUTS:
    case fromExportDataCutsActions.EXPORT_DATA_CUTS_NEW: {
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
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getExporting = (state: State) => state.exporting;
export const getExportingError = (state: State) => state.exportingError;
export const getExportDataCutsModalOpen = (state: State) => state.exportDataCutsModalOpen;
