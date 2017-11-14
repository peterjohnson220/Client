import { ActionReducerMap, createSelector, createFeatureSelector, ActionReducer, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */

import * as fromUserContextReducer from './app-context/reducers/user-context.reducer';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */

export interface AppState {
  userContext: fromUserContextReducer.State;
}

/**
 * Our state is composed of a map of action reducer functions.
 * These reducer functions are called with each dispatched action
 * and the current or initial state and return a new immutable state.
 */
export const reducers: ActionReducerMap<AppState> = {
  userContext: fromUserContextReducer.reducer
};

// console.log all actions
export function logger(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function(state: AppState, action: any): AppState {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

/**
 * By default, @ngrx/store uses combineReducers with the reducer map to compose
 * the root meta-reducer. To add more meta-reducers, provide an array of meta-reducers
 * that will be composed to form the root meta-reducer.
 */
export const metaReducers: MetaReducer<AppState>[] = !environment.production
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
