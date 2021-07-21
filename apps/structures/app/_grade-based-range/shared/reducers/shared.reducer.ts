import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';

import * as fromSharedActions from '../actions/shared.actions';

export interface State {
  gradesDetails: AsyncStateObj<any>;
  openAddJobs: boolean;
  summaryChartSvg: string;
  verticalChartSvg: string;
  showVerticalChart: boolean;
}

const initialState: State = {
  gradesDetails: generateDefaultAsyncStateObj<any>(null),
  openAddJobs: false,
  summaryChartSvg: '',
  verticalChartSvg: '',
  showVerticalChart: true
};

export function reducer(state = initialState, action: fromSharedActions.SharedActions): State {
  switch (action.type) {
    case fromSharedActions.GET_GRADES_DETAILS: {
      const gradesDetails = cloneDeep(state.gradesDetails);

      gradesDetails.loading = true;
      gradesDetails.obj = null;
      gradesDetails.loadingError = false;

      return {
        ...state,
        gradesDetails: gradesDetails
      };
    }
    case fromSharedActions.GET_GRADES_DETAILS_SUCCESS: {
      const gradesDetails = cloneDeep(state.gradesDetails);

      gradesDetails.loading = false;
      gradesDetails.obj = action.payload;

      return {
        ...state,
        gradesDetails: gradesDetails
      };
    }
    case fromSharedActions.GET_GRADES_DETAILS_ERROR: {
      const gradesDetails = cloneDeep(state.gradesDetails);

      gradesDetails.loading = false;
      gradesDetails.loadingError = true;

      return {
        ...state,
        gradesDetails: gradesDetails
      };
    }
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
    case fromSharedActions.SET_VERTICAL_CHART_SVG: {
      return {
        ...state,
        verticalChartSvg: action.payload
      };
    }
    case fromSharedActions.SET_SHOW_VERTICAL_CHART: {
      return {
        ...state,
        showVerticalChart: action.payload
      };
    }
    default:
      return state;
  }
}

export const getGradesDetails = (state: State) => state.gradesDetails;
export const getOpenAddJobs = (state: State) => state.openAddJobs;
export const getSummaryChartSvg = (state: State) => state.summaryChartSvg;
export const getVerticalChartSvg = (state: State) => state.verticalChartSvg;
export const getShowVerticalChart = (state: State) => state.showVerticalChart;
