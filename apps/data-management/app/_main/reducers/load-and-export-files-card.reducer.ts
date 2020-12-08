
import * as fromLoadAndExportFilesCardActions from '../actions/load-and-export-files-card.actions';

export interface LoadAndExportFilesCardState {
  loading: boolean;
  canExportOrgData: boolean;
  canExportPricingData: boolean;
  canExportJobDescription: boolean;
  canScheduleBulkExports: boolean;
}

export const initialState: LoadAndExportFilesCardState = {
  loading: false,
  canExportOrgData: false,
  canExportPricingData: false,
  canExportJobDescription: false,
  canScheduleBulkExports: false
};

export function reducer(state = initialState, action: fromLoadAndExportFilesCardActions.Actions): LoadAndExportFilesCardState {
  switch (action.type) {
    case fromLoadAndExportFilesCardActions.INIT_LOAD_AND_EXPORT_FILES_CARD: {
      return {
        ...state,
        loading: true
      };
    }
    case fromLoadAndExportFilesCardActions.INIT_LOAD_AND_EXPORT_FILES_CARD_SUCCESS: {
      return {
        ...state,
        canExportOrgData: action.payload.canExportOrgData,
        canExportPricingData: action.payload.canExportPricingData,
        canExportJobDescription: action.payload.canExportJobDescription,
        canScheduleBulkExports: action.payload.canScheduleBulkExports,
        loading: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoadAndExportFilesCardState = (state: LoadAndExportFilesCardState) => state;
export const getLoadAndExportFilesCardStateLoading = (state: LoadAndExportFilesCardState) => state.loading;
