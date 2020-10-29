import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromRoot from 'libs/state/state';

import * as fromReportViewReducer from './report-view.reducer';

export interface ReportsFeatureState {
  reportsView: fromReportViewReducer.State;
}

export interface State extends fromRoot.State {
  feature_reports: ReportsFeatureState;
}

export const reducers = {
  reportsView: fromReportViewReducer.reducer
};

export const selectFeatureAreaState = createFeatureSelector<ReportsFeatureState>('feature_reports');

export const selectReportViewState = createSelector(
  selectFeatureAreaState,
  (state: ReportsFeatureState) => state.reportsView
);
// Report View Page
export const getWorkbookViewUrl = createSelector(
  selectReportViewState,
  fromReportViewReducer.getWorkbookViewUrlAsync
);
