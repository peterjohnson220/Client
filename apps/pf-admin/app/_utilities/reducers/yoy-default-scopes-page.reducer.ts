import * as cloneDeep from 'lodash.clonedeep';

import { Company, AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';

import * as fromYoyDefaultScopesPageActions from '../actions/yoy-default-scopes-page.actions';
import { DataListItem, MatchResult, SurveyScope } from '../models';

export interface State {
  loadingCompany: boolean;
  loadingCompanyError: boolean;
  company: Company;
  loadingDefaultScopeSurveys: boolean;
  loadingDefaultScopeSurveysError: boolean;
  defaultScopeSurveys: DataListItem[];
  matchResultsAsync: AsyncStateObj<MatchResult[]>;
  filteredMatchResults: MatchResult[];
  surveyScopesAsync: AsyncStateObj<SurveyScope[]>;
}

const initialState: State = {
  loadingCompany: false,
  loadingCompanyError: false,
  company: null,
  loadingDefaultScopeSurveys: false,
  loadingDefaultScopeSurveysError: false,
  defaultScopeSurveys: [],
  matchResultsAsync: generateDefaultAsyncStateObj<MatchResult[]>([]),
  filteredMatchResults: [],
  surveyScopesAsync: generateDefaultAsyncStateObj<SurveyScope[]>([])
};

export function reducer(state = initialState, action: fromYoyDefaultScopesPageActions.Actions): State {
  switch (action.type) {
    case fromYoyDefaultScopesPageActions.LOAD_COMPANY: {
      return {
        ...state,
        company: null,
        loadingCompany: true,
        loadingCompanyError: false
      };
    }
    case fromYoyDefaultScopesPageActions.LOAD_COMPANY_SUCCESS: {
      return {
        ...state,
        loadingCompany: false,
        company: action.payload
      };
    }
    case fromYoyDefaultScopesPageActions.LOAD_COMPANY_ERROR: {
      return {
        ...state,
        loadingCompany: false,
        loadingCompanyError: true
      };
    }
    case fromYoyDefaultScopesPageActions.LOAD_DEFAULT_SCOPE_SURVEYS: {
      return {
        ...state,
        defaultScopeSurveys: [],
        loadingDefaultScopeSurveys: true,
        loadingDefaultScopeSurveysError: false
      };
    }
    case fromYoyDefaultScopesPageActions.LOAD_DEFAULT_SCOPE_SURVEYS_SUCCESS: {
      return {
        ...state,
        defaultScopeSurveys: action.payload,
        loadingDefaultScopeSurveys: false
      };
    }
    case fromYoyDefaultScopesPageActions.LOAD_DEFAULT_SCOPE_SURVEYS_ERROR: {
      return {
        ...state,
        loadingDefaultScopeSurveys: false,
        loadingDefaultScopeSurveysError: true
      };
    }
    case fromYoyDefaultScopesPageActions.SET_SELECTED_SURVEY: {
      const newDefaultScopeSurveys = state.defaultScopeSurveys.map(s => {
        return { ...s, Selected: s.Id === action.payload.Id };
      });

      return {
        ...state,
        defaultScopeSurveys: newDefaultScopeSurveys,
        surveyScopesAsync: generateDefaultAsyncStateObj<SurveyScope[]>([])
      };
    }
    case fromYoyDefaultScopesPageActions.LOAD_MATCH_RESULTS: {
      const matchResultsAsyncClone = cloneDeep(state.matchResultsAsync);

      matchResultsAsyncClone.loading = true;
      matchResultsAsyncClone.obj = null;
      matchResultsAsyncClone.loadingError = false;

      return {
        ...state,
        matchResultsAsync: matchResultsAsyncClone,
        filteredMatchResults: null
      };
    }
    case fromYoyDefaultScopesPageActions.LOAD_MATCH_RESULTS_SUCCESS: {
      const matchResultsAsyncClone = cloneDeep(state.matchResultsAsync);

      matchResultsAsyncClone.loading = false;
      matchResultsAsyncClone.obj = action.payload;

      return {
        ...state,
        matchResultsAsync: matchResultsAsyncClone,
        filteredMatchResults: matchResultsAsyncClone.obj
      };
    }
    case fromYoyDefaultScopesPageActions.LOAD_MATCH_RESULTS_ERROR: {
      const matchResultsAsyncClone = cloneDeep(state.matchResultsAsync);

      matchResultsAsyncClone.loadingError = true;

      return {
        ...state,
        matchResultsAsync: matchResultsAsyncClone
      };
    }
    case fromYoyDefaultScopesPageActions.SET_SELECTED_MATCH_RESULT: {
      return {
        ...state,
        filteredMatchResults: state.filteredMatchResults.map(mr => {
          return { ...mr, Selected: mr.Id === action.payload.Id };
        })
      };
    }
    case fromYoyDefaultScopesPageActions.FILTER_MATCH_RESULTS: {
      return {
        ...state,
        filteredMatchResults: state.matchResultsAsync.obj.filter(filterByTypeFn(action.payload.type)),
        surveyScopesAsync: generateDefaultAsyncStateObj<SurveyScope[]>([])
      };
    }
    case fromYoyDefaultScopesPageActions.LOAD_SURVEY_SCOPES: {
      const surveyScopesAsyncClone = cloneDeep(state.surveyScopesAsync);

      surveyScopesAsyncClone.loading = true;
      surveyScopesAsyncClone.obj = null;
      surveyScopesAsyncClone.loadingError = false;

      return {
        ...state,
        surveyScopesAsync: surveyScopesAsyncClone
      };
    }
    case fromYoyDefaultScopesPageActions.LOAD_SURVEY_SCOPES_SUCCESS: {
      const surveyScopesAsyncClone = cloneDeep(state.surveyScopesAsync);

      surveyScopesAsyncClone.loading = false;
      surveyScopesAsyncClone.obj = action.payload;

      return {
        ...state,
        surveyScopesAsync: surveyScopesAsyncClone
      };
    }
    case fromYoyDefaultScopesPageActions.LOAD_SURVEY_SCOPES_ERROR: {
      const surveyScopesAsyncClone = cloneDeep(state.surveyScopesAsync);

      surveyScopesAsyncClone.loadingError = true;

      return {
        ...state,
        surveyScopesAsync: surveyScopesAsyncClone
      };
    }
    case fromYoyDefaultScopesPageActions.SET_SELECTED_SURVEY_SCOPE: {
      const surveyScopesAsyncClone = cloneDeep(state.surveyScopesAsync);

      surveyScopesAsyncClone.obj = surveyScopesAsyncClone.obj.map(s => {
        return { ...s, Selected: s.Id === action.payload.Id };
      });

      return {
        ...state,
        surveyScopesAsync: surveyScopesAsyncClone
      };
    }
    case fromYoyDefaultScopesPageActions.RESET: {
      return initialState;
    }
    case fromYoyDefaultScopesPageActions.APPLY_MATCH_SUCCESS: {
      const surveyScopesAsyncClone = cloneDeep(state.surveyScopesAsync);
      surveyScopesAsyncClone.obj = [];

      return {
        ...state,
        surveyScopesAsync: surveyScopesAsyncClone
      };
    }
    default:
      return state;
  }
}

function filterByTypeFn(type: string) {
  let filterFn;

  switch (type) {
    case 'All':
      filterFn = () => true;
      break;
    case 'Exact':
      filterFn = (mr: MatchResult) => mr.IsExactMatch;
      break;
    case 'Mismatch':
      filterFn = (mr: MatchResult) => !mr.IsExactMatch;
      break;
  }

  return filterFn;
}

export const getLoadingCompany = (state: State) => state.loadingCompany;
export const getLoadingCompanyError = (state: State) => state.loadingCompanyError;
export const getCompany = (state: State) => state.company;
export const getLoadingDefaultScopeSurveys = (state: State) => state.loadingDefaultScopeSurveys;
export const getLoadingDefaultScopeSurveysError = (state: State) => state.loadingDefaultScopeSurveysError;
export const getDefaultScopeSurveys = (state: State) => state.defaultScopeSurveys;
export const getSelectedDefaultScopeSurvey = (state: State) => state.defaultScopeSurveys.find(dss => dss.Selected);
export const getMatchResultsAsync = (state: State) => state.matchResultsAsync;
export const getFilteredMatchResults = (state: State) => state.filteredMatchResults;
export const getSelectedMatchResult = (state: State) => {
  if (!state.filteredMatchResults) { return; }
  return state.filteredMatchResults.find(mr => mr.Selected);
};
export const getSurveyScopesAsync = (state: State) => state.surveyScopesAsync;
export const getSelectedScope = (state: State) => {
  if (!state.surveyScopesAsync.obj) { return; }
  return state.surveyScopesAsync.obj.find(mr => mr.Selected);
};
