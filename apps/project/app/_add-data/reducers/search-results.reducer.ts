import * as cloneDeep from 'lodash.clonedeep';
import * as fromSearchResultsActions from '../actions/search-results.actions';

import { DataCut } from 'libs/models/survey-search';

import { DataCutDetails, JobResult, ResultsPagingOptions } from '../models';
import { mapSurveyJobsToJobResults, mapSurveyDataCutResultsToDataCut, applyMatchesToJobResults } from '../helpers';

export interface State {
  results: JobResult[];
  loadingMoreResults: boolean;
  loadingResults: boolean;
  pagingOptions: ResultsPagingOptions;
  totalResultsOnServer: number;
  selectedDataCuts: DataCutDetails[];
  error: boolean;
}

const initialState: State = {
  results: [],
  loadingMoreResults: false,
  loadingResults: false,
  pagingOptions: {
    page: 1,
    pageSize: 25
  },
  totalResultsOnServer: 0,
  selectedDataCuts: [],
  error: false
};

// Reducer function
export function reducer(state = initialState, action: fromSearchResultsActions.Actions): State {
  switch (action.type) {
    case fromSearchResultsActions.GET_RESULTS: {
      return {
        ...state,
        error: false,
        loadingResults: true,
        pagingOptions: initialState.pagingOptions
      };
    }
    case fromSearchResultsActions.GET_RESULTS_SUCCESS: {
      return {
        ...state,
        results: mapSurveyJobsToJobResults(action.payload.SurveyJobs, state.selectedDataCuts),
        loadingResults: false,
        totalResultsOnServer: action.payload.Paging.TotalRecordCount
      };
    }
    case fromSearchResultsActions.GET_MORE_RESULTS: {
      return {
        ...state,
        error: false,
        loadingMoreResults: true,
        pagingOptions: {...state.pagingOptions, page: state.pagingOptions.page + 1}
      };
    }
    case fromSearchResultsActions.GET_MORE_RESULTS_SUCCESS: {
      return {
        ...state,
        results: state.results.concat(mapSurveyJobsToJobResults(action.payload.SurveyJobs, state.selectedDataCuts)),
        loadingMoreResults: false
      };
    }
    case fromSearchResultsActions.GET_RESULTS_ERROR: {
      return {
        ...state,
        error: true
      };
    }
    case fromSearchResultsActions.CLEAR_RESULTS: {
      return {
        ...state,
        results: [],
        totalResultsOnServer: 0
      };
    }
    case fromSearchResultsActions.TOGGLE_SURVEY_DATA_CUT_SELECTION: {
      const resultsCopy = cloneDeep(state.results);
      let selectedDataCuts = cloneDeep(state.selectedDataCuts);
      const dataCut = action.payload;

      const matchingDataCut = getMatchingDataCut(dataCut, selectedDataCuts);
      if (matchingDataCut) {
        // remove cut
        selectedDataCuts = selectedDataCuts.filter(cutData => cutData !== matchingDataCut);
        // deselect data cut in results
        setSelectedPropertyInSearchResults(dataCut, resultsCopy, false);
      } else {
        // add cut
        selectedDataCuts = selectedDataCuts.concat(dataCut);
        // select data cut in results
        setSelectedPropertyInSearchResults(dataCut, resultsCopy, true);
      }
      return {
        ...state,
        selectedDataCuts: selectedDataCuts,
        results: resultsCopy
      };
    }

    case fromSearchResultsActions.CLEAR_DATA_CUT_SELECTIONS: {
      const resultsCopy = cloneDeep(state.results);
      deselectAllCutsInSearchResults(resultsCopy);
      return {
        ...state,
        selectedDataCuts: [],
        results: resultsCopy
      };
    }

    case fromSearchResultsActions.GET_SURVEY_DATA_RESULTS: {
      const surveyJobId = action.payload.Id;
      const resultsCopy = cloneDeep(state.results);
      const surveyJob = resultsCopy.find(t => t.Id === surveyJobId);
      surveyJob.LoadingDataCuts = !surveyJob.DataCuts.length;
      surveyJob.LoadingMoreDataCuts = !!surveyJob.DataCuts.length;
      return {
        ...state,
        results: resultsCopy
      };
    }
    case fromSearchResultsActions.GET_SURVEY_DATA_RESULTS_SUCCESS: {
      const surveyJobId = action.payload.SurveyJobId;
      const resultsCopy = cloneDeep(state.results);
      const surveyJob = resultsCopy.find(t => t.Id === surveyJobId);
      const dataCuts = mapSurveyDataCutResultsToDataCut(action.payload.DataCuts, state.selectedDataCuts);
      surveyJob.LoadingDataCuts = false;
      surveyJob.LoadingMoreDataCuts = false;
      surveyJob.TotalDataCuts = action.payload.TotalResults;
      surveyJob.DataCuts = surveyJob.DataCuts.concat(dataCuts);
      return {
        ...state,
        results: resultsCopy
      };
    }
    case fromSearchResultsActions.UPDATE_RESULTS_MATCHES_COUNT: {
      const resultsCopy = cloneDeep(state.results);
      return {
        ...state,
        results: applyMatchesToJobResults(resultsCopy, action.payload)
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getResults = (state: State) => state.results;
export const getLoadingResults = (state: State) => state.loadingResults;
export const getLoadingMoreResults = (state: State) => state.loadingMoreResults;
export const getPagingOptions = (state: State) => state.pagingOptions;
export const getNumberOfResults = (state: State) => state.totalResultsOnServer;
export const hasMoreResultsOnServer = (state: State) => state.totalResultsOnServer > state.results.length;
export const getSelectedDataCuts = (state: State) => state.selectedDataCuts;
export const getError = (state: State) => state.error;

function getMatchingDataCut(dataCut: DataCut, selectedDataCuts: DataCut[]) {
  let matchingDataCut = filter => filter.SurveyJobCode === dataCut.SurveyJobCode && filter.CountryCode === dataCut.CountryCode;
  if (!dataCut.IsPayfactorsJob) {
    matchingDataCut = filter => filter.DataCutId === dataCut.DataCutId;
  }
  return selectedDataCuts.find(matchingDataCut);
}

function setSelectedPropertyInSearchResults(dataCut: DataCut, resultsCopy: JobResult[], isSelected: boolean) {
  if (dataCut.IsPayfactorsJob) {
    const payfactorsJob = resultsCopy.find(job => job.Code === dataCut.SurveyJobCode && job.CountryCode === dataCut.CountryCode);
    payfactorsJob.IsSelected = isSelected;
  } else {
    const surveyJob = resultsCopy.find(job => job.Id === dataCut.SurveyJobId);
    const surveyCut = surveyJob.DataCuts.find(surveyData => surveyData.SurveyDataId === dataCut.DataCutId);
    surveyCut.IsSelected = isSelected;
  }
}

function deselectAllCutsInSearchResults(resultsCopy: JobResult[]) {
    resultsCopy.map(result => {
      if (result.DataCuts && result.DataCuts.length) {
        result.DataCuts.map(dc => dc.IsSelected = false);
      }
    });
}
