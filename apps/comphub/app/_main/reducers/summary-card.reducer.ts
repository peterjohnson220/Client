import * as fromSummaryCardActions from '../actions/summary-card.actions';
import { JobSalaryTrend } from '../models';

export interface State {
  salaryTrendData: JobSalaryTrend;
  loadingSalaryTrend: boolean;
  loadingSalaryTrendError: boolean;
  sharePricingSummaryModalOpen: boolean;
  sharePricingSummaryError: boolean;
  sharePricingSummaryConflict: boolean;
  creatingProject: boolean;
  createProjectError: boolean;
  canAccessProjectsTile: boolean;
  glossaryOpen: boolean;
}

const initialState: State = {
  salaryTrendData: null,
  loadingSalaryTrend: false,
  loadingSalaryTrendError: false,
  sharePricingSummaryModalOpen: false,
  sharePricingSummaryError: false,
  sharePricingSummaryConflict: false,
  creatingProject: false,
  createProjectError: false,
  canAccessProjectsTile: false,
  glossaryOpen: false
};

// Reducer function
export function reducer(state = initialState, action: fromSummaryCardActions.Actions): State {
  switch (action.type) {

    case fromSummaryCardActions.GET_JOB_NATIONAL_TREND: {
      return {
        ...state,
        loadingSalaryTrend: true
      };
    }
    case fromSummaryCardActions.GET_JOB_NATIONAL_TREND_SUCCESS: {
      return {
        ...state,
        loadingSalaryTrend: false,
        loadingSalaryTrendError: false,
        salaryTrendData: action.payload
      };
    }
    case fromSummaryCardActions.GET_JOB_NATIONAL_TREND_ERROR: {
      return {
        ...state,
        loadingSalaryTrend: false,
        loadingSalaryTrendError: true
      };
    }
    case fromSummaryCardActions.OPEN_SHARE_MODAL: {
      return {
        ...state,
        sharePricingSummaryModalOpen: true
      };
    }
    case fromSummaryCardActions.CLOSE_SHARE_MODAL: {
      return {
        ...state,
        sharePricingSummaryModalOpen: false
      };
    }
    case fromSummaryCardActions.SHARE_PRICING_SUMMARY: {
      return {
        ...state,
        sharePricingSummaryError: false,
        sharePricingSummaryConflict: false
      };
    }
    case fromSummaryCardActions.SHARE_PRICING_SUMMARY_ERROR: {
      return {
        ...state,
        sharePricingSummaryError: true
      };
    }
    case fromSummaryCardActions.SHARE_PRICING_SUMMARY_CONFLICT: {
      return {
        ...state,
        sharePricingSummaryConflict: true
      };
    }
    case fromSummaryCardActions.CREATE_PROJECT: {
      return {
        ...state,
        creatingProject: true,
        createProjectError: false
      };
    }
    case fromSummaryCardActions.RESET_CREATE_PROJECT_STATUS:
    case fromSummaryCardActions.CREATE_PROJECT_SUCCESS: {
      return {
        ...state,
        creatingProject: false,
        createProjectError: false
      };
    }
    case fromSummaryCardActions.CREATE_PROJECT_ERROR: {
      return {
        ...state,
        creatingProject: false,
        createProjectError: true
      };
    }
    case fromSummaryCardActions.SET_PROJECT_TILE_ACCESS: {
      return {
        ...state,
        canAccessProjectsTile: action.payload
      };
    }
    case fromSummaryCardActions.TOGGLE_GLOSSARY_DISPLAY: {
      return {
        ...state,
        glossaryOpen: action.payload.open
      };
    }

    default: {
      return state;
    }
  }
}

// Selector functions
export const getSalaryTrendData = (state: State) => state.salaryTrendData;
export const getLoadingSalaryTrendData = (state: State) => state.loadingSalaryTrend;
export const getLoadingSalaryTrendError = (state: State) => state.loadingSalaryTrendError;
export const getSharePricingSummaryModalOpen = (state: State) => state.sharePricingSummaryModalOpen;
export const getSharePricingSummaryError = (state: State) => state.sharePricingSummaryError;
export const getSharePricingSummaryConflict = (state: State) => state.sharePricingSummaryConflict;
export const getCreatingProject = (state: State) => state.creatingProject;
export const getCreatingProjectError = (state: State) => state.createProjectError;
export const getCanAccessProjectTile = (state: State) => state.canAccessProjectsTile;
export const getGlossaryOpen = (state: State) => state.glossaryOpen;
