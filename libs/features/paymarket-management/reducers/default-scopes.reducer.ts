import { cloneDeep } from 'lodash';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromDefaultScopesActions from '../actions/default-scopes.actions';
import { CompanySurvey, DefaultScope, CombinedScope } from '../models';
import { DefaultScopesHelper } from '../helpers';

export interface State {
  surveys: AsyncStateObj<CompanySurvey[]>;
  hasMoreData: boolean;
  combinedScopes: AsyncStateObj<CombinedScope[]>;
  selectedDefaultScopes: DefaultScope[];
}

export const initialState: State = {
  surveys: generateDefaultAsyncStateObj<CompanySurvey[]>([]),
  hasMoreData: false,
  combinedScopes: generateDefaultAsyncStateObj<CombinedScope[]>([]),
  selectedDefaultScopes: []
};

export function reducer(state = initialState, action: fromDefaultScopesActions.Actions): State {
  switch (action.type) {
    case fromDefaultScopesActions.LOAD_COMPANY_SURVEYS: {
      const surveysClone: AsyncStateObj<CompanySurvey[]> = cloneDeep(state.surveys);
      surveysClone.loading = true;
      surveysClone.loadingError = false;
      return {
        ...state,
        surveys: surveysClone
      };
    }
    case fromDefaultScopesActions.LOAD_COMPANY_SURVEYS_SUCCESS: {
      const surveysClone: AsyncStateObj<CompanySurvey[]> = cloneDeep(state.surveys);
      surveysClone.loading = false;
      surveysClone.obj = DefaultScopesHelper.mapSurveysToCompanySurveys(action.payload.Surveys);
      return {
        ...state,
        surveys: surveysClone,
        hasMoreData: action.payload.HasMoreData
      };
    }
    case fromDefaultScopesActions.LOAD_COMPANY_SURVEYS_ERROR: {
      const surveysClone: AsyncStateObj<CompanySurvey[]> = cloneDeep(state.surveys);
      surveysClone.loading = false;
      surveysClone.loadingError = true;
      return {
        ...state,
        surveys: surveysClone
      };
    }
    case fromDefaultScopesActions.LOAD_MORE_COMPANY_SURVEYS_SUCCESS: {
      const surveysClone: AsyncStateObj<CompanySurvey[]> = cloneDeep(state.surveys);
      const surveys = DefaultScopesHelper.mapSurveysToCompanySurveys(action.payload.Surveys);
      surveysClone.loading = false;
      surveysClone.obj = surveysClone.obj.concat(surveys);
      return {
        ...state,
        surveys: surveysClone,
        hasMoreData: action.payload.HasMoreData
      };
    }
    case fromDefaultScopesActions.LOAD_COMBINED_SCOPES: {
      const combinedScopesClone: AsyncStateObj<CombinedScope[]> = cloneDeep(state.combinedScopes);
      combinedScopesClone.loading = true;
      combinedScopesClone.loadingError = false;
      return {
        ...state,
        combinedScopes: combinedScopesClone
      };
    }
    case fromDefaultScopesActions.LOAD_COMBINED_SCOPES_SUCCESS: {
      const combinedScopesClone: AsyncStateObj<CombinedScope[]> = cloneDeep(state.combinedScopes);
      combinedScopesClone.loading = false;
      combinedScopesClone.obj = action.payload;
      return {
        ...state,
        combinedScopes: combinedScopesClone
      };
    }
    case fromDefaultScopesActions.LOAD_COMBINED_SCOPES_ERROR: {
      const combinedScopesClone: AsyncStateObj<CombinedScope[]> = cloneDeep(state.combinedScopes);
      combinedScopesClone.loading = false;
      combinedScopesClone.loadingError = true;
      return {
        ...state,
        combinedScopes: combinedScopesClone
      };
    }
    case fromDefaultScopesActions.ADD_DEFAULT_SCOPE: {
      const defaultScopesClone: DefaultScope[] = cloneDeep(state.selectedDefaultScopes);
      defaultScopesClone.push(action.payload);
      return {
        ...state,
        selectedDefaultScopes: defaultScopesClone
      };
    }
    case fromDefaultScopesActions.REMOVE_DEFAULT_SCOPE: {
      const defaultScopesClone: DefaultScope[] = cloneDeep(state.selectedDefaultScopes);
      defaultScopesClone.splice(action.payload.defaultScopeIndex, 1);
      return {
        ...state,
        selectedDefaultScopes: defaultScopesClone
      };
    }
    case fromDefaultScopesActions.RESET_DEFAULT_SCOPES: {
      return {
        ...state,
        selectedDefaultScopes: []
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompanySurveys = (state: State) => state.surveys;
export const getHasMoreCompanySurveys = (state: State) => state.hasMoreData;
export const getCombinedScopes = (state: State) => state.combinedScopes;
export const getSelectedDefaultScopes = (state: State) => state.selectedDefaultScopes;
