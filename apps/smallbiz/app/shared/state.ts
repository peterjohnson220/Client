import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromUserContextReducer from './reducers/user-context.reducer';

export interface AppState {
    userContext: fromUserContextReducer.State;
}

export const reducers: ActionReducerMap<AppState> = {
    userContext: fromUserContextReducer.reducer
};

/* User Context Selectors */
export const selectUserContextState = createFeatureSelector<fromUserContextReducer.State>('userContext');
export const selectUserContextModel = createSelector(selectUserContextState, fromUserContextReducer.getUserContext);
