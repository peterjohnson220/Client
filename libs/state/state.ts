import { ActionReducerMap, createSelector, createFeatureSelector, ActionReducer, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

import * as fromUserContextReducer from './app-context/reducers/user-context.reducer';

export interface State {
  userContext: fromUserContextReducer.State;
}

export const reducers: ActionReducerMap<State> = {
  userContext: fromUserContextReducer.reducer
};

export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function(state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];

/**
 * User Context Reducers
 */
export const getUserContextState = createFeatureSelector<fromUserContextReducer.State>('userContext');

export const getUserContext = createSelector(getUserContextState, fromUserContextReducer.getUserContext);
export const getGettingUserContext = createSelector(getUserContextState, fromUserContextReducer.getGettingUserContext);
export const getGettingUserContextError = createSelector(getUserContextState, fromUserContextReducer.getGettingUserContextError);
export const getGettingUserContextAttempted = createSelector(getUserContextState, fromUserContextReducer.getGettingUserContextAttempted);
