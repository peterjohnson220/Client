import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromJobInsightsReducer from './job-insights.reducer';

export interface JobInsightsMainState {
  jobInsights: fromJobInsightsReducer.State;
}

export interface State extends fromRoot.State {
  jobInsights_main: JobInsightsMainState;
}

export const reducers = {
  jobInsights: fromJobInsightsReducer.reducer
};

export const selectFeatureAreaState = createFeatureSelector<JobInsightsMainState>('jobInsights_main');

export const selectJobInsightsState = createSelector(
  selectFeatureAreaState,
  (state: JobInsightsMainState) => state.jobInsights
);

export const getJobInsights = createSelector(selectJobInsightsState, fromJobInsightsReducer.getJobInsights);
export const getJobCustomFields = createSelector(selectJobInsightsState, fromJobInsightsReducer.getJobCustomFields);
