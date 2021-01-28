import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromDefaultScopesActions from '../actions/default-scopes.actions';
import { CompanySurvey, DefaultScope, CombinedScope } from '../models';
import { DefaultScopesHelper } from '../helpers';

export interface State {
  surveys: AsyncStateObj<CompanySurvey[]>;
  hasMoreData: boolean;
  combinedScopes: AsyncStateObj<CombinedScope[]>;
  defaultScopes: AsyncStateObj<DefaultScope[]>;
  defaultScopesToAdd: DefaultScope[];
  defaultScopesToDelete: number[];
}

export const initialState: State = {
  surveys: generateDefaultAsyncStateObj<CompanySurvey[]>([]),
  hasMoreData: false,
  combinedScopes: generateDefaultAsyncStateObj<CombinedScope[]>([]),
  defaultScopes: generateDefaultAsyncStateObj<DefaultScope[]>([]),
  defaultScopesToAdd: [],
  defaultScopesToDelete: []
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
      const defaultScopesClone: AsyncStateObj<DefaultScope[]> = cloneDeep(state.defaultScopes);
      const defaultScopesToAddClone: DefaultScope[] = cloneDeep(state.defaultScopesToAdd);
      defaultScopesClone.obj.push(action.payload);
      defaultScopesToAddClone.push(action.payload);
      return {
        ...state,
        defaultScopes: defaultScopesClone,
        defaultScopesToAdd : defaultScopesToAddClone
      };
    }
    case fromDefaultScopesActions.REMOVE_DEFAULT_SCOPE: {
      const defaultScopesClone: AsyncStateObj<DefaultScope[]> = cloneDeep(state.defaultScopes);
      const defaultScopesToDeleteClone: number[] = cloneDeep(state.defaultScopesToDelete);
      let defaultScopesToAddClone: DefaultScope[] = cloneDeep(state.defaultScopesToAdd);

      defaultScopesToAddClone = DefaultScopesHelper.removeDefaultScope(defaultScopesToAddClone, defaultScopesClone.obj[action.payload.defaultScopeIndex]);
      defaultScopesToDeleteClone.push(defaultScopesClone.obj[action.payload.defaultScopeIndex].Scope.CompanySurveyScopesId);
      defaultScopesClone.obj.splice(action.payload.defaultScopeIndex, 1);
      return {
        ...state,
        defaultScopes: defaultScopesClone,
        defaultScopesToDelete: defaultScopesToDeleteClone,
        defaultScopesToAdd: defaultScopesToAddClone
      };
    }
    case fromDefaultScopesActions.RESET_DEFAULT_SCOPES: {
      const defaultScopesClone: AsyncStateObj<DefaultScope[]> = cloneDeep(state.defaultScopes);
      defaultScopesClone.loading = false;
      defaultScopesClone.loadingError = false;
      defaultScopesClone.obj = [];
      return {
        ...state,
        defaultScopes: defaultScopesClone,
        defaultScopesToDelete: [],
        defaultScopesToAdd: []
      };
    }
    case fromDefaultScopesActions.LOAD_DEFAULT_SCOPES: {
      const defaultScopesClone: AsyncStateObj<DefaultScope[]> = cloneDeep(state.defaultScopes);
      defaultScopesClone.loading = true;
      defaultScopesClone.loadingError = false;
      return {
        ...state,
        defaultScopes: defaultScopesClone
      };
    }
    case fromDefaultScopesActions.LOAD_DEFAULT_SCOPES_SUCCESS: {
      const defaultScopesClone: AsyncStateObj<DefaultScope[]> = cloneDeep(state.defaultScopes);
      defaultScopesClone.loading = false;
      defaultScopesClone.obj = action.payload;
      return {
        ...state,
        defaultScopes: defaultScopesClone
      };
    }
    case fromDefaultScopesActions.LOAD_DEFAULT_SCOPES_ERROR: {
      const defaultScopesClone: AsyncStateObj<DefaultScope[]> = cloneDeep(state.defaultScopes);
      defaultScopesClone.loading = false;
      defaultScopesClone.loadingError = true;
      return {
        ...state,
        defaultScopes: defaultScopesClone
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
export const getDefaultScopes = (state: State) => state.defaultScopes;
export const getDefaultScopesToDelete = (state: State) => state.defaultScopesToDelete;
export const getDefaultScopesToAdd = (state: State) => state.defaultScopesToAdd;
