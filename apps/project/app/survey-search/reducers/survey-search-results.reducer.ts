import * as cloneDeep from 'lodash.clonedeep';

import { SurveySearchResultDataSources } from 'libs/constants';

import * as fromSurveySearchResultsActions from '../actions/survey-search-results.actions';
import { DataCutDetails, JobResult } from '../models';
import { applyMatchesToJobResults } from '../helpers';

export interface State {
  results: JobResult[];
  selectedDataCuts: DataCutDetails[];
}

const initialState: State = {
  results: [],
  selectedDataCuts: []
};

// Reducer function
export function reducer(state = initialState, action: fromSurveySearchResultsActions.Actions): State {
  switch (action.type) {
    case fromSurveySearchResultsActions.REPLACE_JOB_RESULTS: {
      return {
        ...state,
        results: action.payload
      };
    }
    case fromSurveySearchResultsActions.ADD_JOB_RESULTS: {
      return {
        ...state,
        results: state.results.concat(action.payload)
      };
    }
    case fromSurveySearchResultsActions.CLEAR_RESULTS: {
      return {
        ...state,
        results: []
      };
    }
    case fromSurveySearchResultsActions.TOGGLE_SURVEY_DATA_CUT_SELECTION: {
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
    case fromSurveySearchResultsActions.CLEAR_DATA_CUT_SELECTIONS: {
      const resultsCopy = cloneDeep(state.results);
      deselectAllCutsInSearchResults(resultsCopy);
      return {
        ...state,
        selectedDataCuts: [],
        results: resultsCopy
      };
    }
    case fromSurveySearchResultsActions.GET_SURVEY_DATA_RESULTS: {
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
    case fromSurveySearchResultsActions.GET_SURVEY_DATA_RESULTS_SUCCESS: {
      const surveyJobId = action.payload.SurveyJobId;
      const resultsCopy = cloneDeep(state.results);
      const surveyJob = resultsCopy.find(t => t.Id === surveyJobId);
      const dataCuts = action.payload.DataCuts;
      surveyJob.LoadingDataCuts = false;
      surveyJob.LoadingMoreDataCuts = false;
      surveyJob.LoadingDataCutsError = false;
      surveyJob.TotalDataCuts = action.payload.TotalResults;
      surveyJob.DataCuts = surveyJob.DataCuts.concat(dataCuts);
      return {
        ...state,
        results: resultsCopy
      };
    }
    case fromSurveySearchResultsActions.GET_SURVEY_DATA_RESULTS_ERROR: {
      const surveyJobId = action.payload;
      const resultsCopy = cloneDeep(state.results);
      const surveyJob = resultsCopy.find(t => t.Id === surveyJobId);
      surveyJob.LoadingDataCuts = false;
      surveyJob.LoadingMoreDataCuts = false;
      surveyJob.LoadingDataCutsError = true;
      return {
        ...state,
        results: resultsCopy
      };
    }
    case fromSurveySearchResultsActions.GET_EXCHANGE_DATA_RESULTS: {
      const id = action.payload.PeerJobInfo.ExchangeJobId;
      const resultsCopy = cloneDeep(state.results);
      const job = resultsCopy.find(r => r.PeerJobInfo.ExchangeJobId === id);
      job.LoadingDataCuts = !job.DataCuts.length;
      job.LoadingDataCutsError = false;
      return {
        ...state,
        results: resultsCopy
      };
    }
    case fromSurveySearchResultsActions.GET_EXCHANGE_DATA_RESULTS_SUCCESS: {
      const id = action.payload.ExchangeJobId;
      const resultsCopy = cloneDeep(state.results);
      const job = resultsCopy.find(r => r.PeerJobInfo.ExchangeJobId === id);
      const dataCuts = action.payload.DataCuts;

      job.LoadingDataCuts = false;
      job.DataCuts = job.DataCuts.concat(dataCuts);
      return {
        ...state,
        results: resultsCopy
      };
    }
    case fromSurveySearchResultsActions.GET_EXCHANGE_DATA_RESULTS_ERROR: {
      const id = action.payload.exchangeJobId;
      const resultsCopy = cloneDeep(state.results);
      const job = resultsCopy.find(r => r.PeerJobInfo.ExchangeJobId === id);
      job.LoadingDataCuts = false;
      job.LoadingDataCutsError = true;
      return {
        ...state,
        results: resultsCopy
      };
    }
    case fromSurveySearchResultsActions.UPDATE_RESULTS_MATCHES_COUNT: {
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
export const getSelectedDataCuts = (state: State) => state.selectedDataCuts;

function getMatchingDataCut(dataCut: DataCutDetails, selectedDataCuts: DataCutDetails[]) {
  let matchingDataCut = filter => filter.SurveyJobCode === dataCut.SurveyJobCode && filter.CountryCode === dataCut.CountryCode;
  if (dataCut.DataSource === SurveySearchResultDataSources.Surveys) {
    matchingDataCut = filter => filter.DataCutId === dataCut.DataCutId;
  } else if (dataCut.DataSource === SurveySearchResultDataSources.Peer) {
    matchingDataCut = filter => filter.DataSource === SurveySearchResultDataSources.Peer &&
      filter.Job.PeerJobInfo.Id === dataCut.Job.PeerJobInfo.Id;
  }
  return selectedDataCuts.find(matchingDataCut);
}

function setSelectedPropertyInSearchResults(dataCut: DataCutDetails, resultsCopy: JobResult[], isSelected: boolean) {
  if (dataCut.DataSource === SurveySearchResultDataSources.Payfactors) {
    const payfactorsJob = resultsCopy.find(job =>
      job.Code === dataCut.SurveyJobCode &&
      job.CountryCode === dataCut.CountryCode &&
      job.DataSource === SurveySearchResultDataSources.Payfactors);
    payfactorsJob.IsSelected = isSelected;
  } else if (dataCut.DataSource === SurveySearchResultDataSources.Peer) {
    const peerJob = resultsCopy.find(job => job.PeerJobInfo.Id === dataCut.Job.PeerJobInfo.Id);
    peerJob.IsSelected = isSelected;
  } else {
    const surveyJob = resultsCopy.find(job => job.Id === dataCut.SurveyJobId);
    const surveyCut = surveyJob.DataCuts.find(surveyData => surveyData.Id === dataCut.DataCutId);
    surveyCut.IsSelected = isSelected;
  }
}

function deselectAllCutsInSearchResults(resultsCopy: JobResult[]) {
    resultsCopy.map(result => {
      result.IsSelected = false;
      if (result.DataCuts && result.DataCuts.length) {
        result.DataCuts.map(dc => dc.IsSelected = false);
      }
    });
}
