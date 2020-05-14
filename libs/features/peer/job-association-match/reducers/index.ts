import {createFeatureSelector, createSelector} from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromJobAssociationMatchReducer from './associate-jobs.reducer';

export interface JobAssociationMatchState {
  exportJobAssociationMatches: fromJobAssociationMatchReducer.State;
}

export interface State extends fromRoot.State {
  exportJobAssociationMatches: JobAssociationMatchState;
}

export const reducers = {
  exportJobAssociationMatches: fromJobAssociationMatchReducer.reducer
};

export const selectFeatureState = createFeatureSelector<JobAssociationMatchState>('feature_jobAssociationMatch');

export const selectJobAssociationMatchState = createSelector(selectFeatureState, (state: JobAssociationMatchState) => state.exportJobAssociationMatches);

export const getExportingMatches = createSelector(selectJobAssociationMatchState, fromJobAssociationMatchReducer.getLoading);

export const getExportingMatchesError = createSelector(selectJobAssociationMatchState, fromJobAssociationMatchReducer.getLoadingError);
