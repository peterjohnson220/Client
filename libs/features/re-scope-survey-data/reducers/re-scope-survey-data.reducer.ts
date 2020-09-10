import { AsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';

import { ReScopeSurveyDataContext } from '../models';
import * as fromReScopeSurveyDataActions from '../actions';

export interface State {
  reScopeContext: AsyncStateObj<ReScopeSurveyDataContext>;
}

export const initialState: State = {
  reScopeContext: undefined
};

export function reducer(state = initialState, action: fromReScopeSurveyDataActions.Actions): State {
  switch (action.type) {
    case fromReScopeSurveyDataActions.GET_RE_SCOPE_SURVEY_DATA_CONTEXT_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'reScopeContext', action.payload);
    default:
      return state;
  }
}

export const getReScopeContext = (state: State) => state.reScopeContext;
