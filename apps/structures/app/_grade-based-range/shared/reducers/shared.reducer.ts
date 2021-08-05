import * as fromSharedActions from '../actions/shared.actions';

export interface State {
  openAddJobs: boolean;
  summaryChartSvg: string;
  horizontalChartSvg: string;
  showHorizontalChart: boolean;
}

const initialState: State = {
  openAddJobs: false,
  summaryChartSvg: '',
  horizontalChartSvg: '',
  showHorizontalChart: true
};

export function reducer(state = initialState, action: fromSharedActions.SharedActions): State {
  switch (action.type) {
    case fromSharedActions.SET_OPEN_ADD_JOBS: {
      return {
        ...state,
        openAddJobs: action.payload
      };
    }
    case fromSharedActions.SET_SUMMARY_CHART_SVG: {
      return {
        ...state,
        summaryChartSvg: action.payload
      };
    }
    case fromSharedActions.SET_HORIZONTAL_CHART_SVG: {
      return {
        ...state,
        horizontalChartSvg: action.payload
      };
    }
    case fromSharedActions.SET_SHOW_HORIZONTAL_CHART: {
      return {
        ...state,
        showHorizontalChart: action.payload
      };
    }
    default:
      return state;
  }
}

export const getOpenAddJobs = (state: State) => state.openAddJobs;
export const getSummaryChartSvg = (state: State) => state.summaryChartSvg;
export const getHorizontalChartSvg = (state: State) => state.horizontalChartSvg;
export const getShowHorizontalChart = (state: State) => state.showHorizontalChart;
