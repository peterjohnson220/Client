import { ActionReducerMap, createSelector, createFeatureSelector, ActionReducer, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';


import * as fromUserContextReducer from './app-context/reducers/user-context.reducer';



export interface AppState {
  userContext: fromUserContextReducer.State;
}


export const reducers: ActionReducerMap<AppState> = {
  userContext: fromUserContextReducer.reducer
};


export function logger(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function(state: AppState, action: any): AppState {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}


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
