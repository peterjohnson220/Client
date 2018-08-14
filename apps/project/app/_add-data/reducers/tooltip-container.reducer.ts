import * as fromTooltipContainerAtions from '../actions/tooltip-container.actions';

export interface State {
  jobDetailsTooltipOpen: boolean;
  loadingMatchesDetails: boolean;
  matchesDetails: string[];
  matchesDetailsTooltipOpen: boolean;
}

const initialState: State = {
  jobDetailsTooltipOpen: false,
  loadingMatchesDetails: false,
  matchesDetails: [],
  matchesDetailsTooltipOpen: false
};

export function reducer(state = initialState, action: fromTooltipContainerAtions.Actions): State {
  switch (action.type) {
    case fromTooltipContainerAtions.OPEN_JOB_DETAILS_TOOLTIP: {
      return {
        ...state,
        jobDetailsTooltipOpen: true
      };
    }
    case fromTooltipContainerAtions.CLOSE_JOB_DETAILS_TOOLTIP: {
      return {
        ...state,
        jobDetailsTooltipOpen: false
      };
    }
    case fromTooltipContainerAtions.GET_MATCHES_DETAILS: {
      return {
        ...state,
        loadingMatchesDetails: true
      };
    }
    case fromTooltipContainerAtions.GET_MATCHES_DETAILS_SUCCESS: {
      return {
        ...state,
        loadingMatchesDetails: false,
        matchesDetails: action.payload
      };
    }
    case fromTooltipContainerAtions.OPEN_MATCHES_DETAILS_TOOLTIP: {
      return {
        ...state,
        matchesDetailsTooltipOpen: true
      };
    }
    case fromTooltipContainerAtions.CLOSE_MATCHES_DETAILS_TOOLTIP: {
      return {
        ...state,
        matchesDetailsTooltipOpen: false
      };
    }
    default:
      return state;
  }
}

export const getJobDetailsTooltipOpen = (state: State) => state.jobDetailsTooltipOpen;
export const getLoadingMatchesDetails = (state: State) => state.loadingMatchesDetails;
export const getMatchesDetails = (state: State) => state.matchesDetails;
export const getMatchesDetailsTooltipOpen = (state: State) => state.matchesDetailsTooltipOpen;
