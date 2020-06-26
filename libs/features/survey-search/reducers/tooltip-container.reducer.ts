import * as fromTooltipContainerActions from '../actions/tooltip-container.actions';

export interface State {
  loadingMatchesDetails: boolean;
  matchesDetails: string[];
  matchesDetailsTooltipOpen: boolean;
}

const initialState: State = {
  loadingMatchesDetails: false,
  matchesDetails: [],
  matchesDetailsTooltipOpen: false
};

export function reducer(state = initialState, action: fromTooltipContainerActions.Actions): State {
  switch (action.type) {
    case fromTooltipContainerActions.GET_MATCHES_DETAILS: {
      return {
        ...state,
        loadingMatchesDetails: true
      };
    }
    case fromTooltipContainerActions.GET_MATCHES_DETAILS_SUCCESS: {
      return {
        ...state,
        loadingMatchesDetails: false,
        matchesDetails: action.payload
      };
    }
    case fromTooltipContainerActions.OPEN_MATCHES_DETAILS_TOOLTIP: {
      return {
        ...state,
        matchesDetailsTooltipOpen: true
      };
    }
    case fromTooltipContainerActions.CLOSE_MATCHES_DETAILS_TOOLTIP: {
      return {
        ...state,
        matchesDetailsTooltipOpen: false
      };
    }
    default:
      return state;
  }
}

export const getLoadingMatchesDetails = (state: State) => state.loadingMatchesDetails;
export const getMatchesDetails = (state: State) => state.matchesDetails;
export const getMatchesDetailsTooltipOpen = (state: State) => state.matchesDetailsTooltipOpen;
