import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

import * as fromProjectListPageReducer from './project-list-page.reducer';

export interface ProjectListPageStateMain {
  projectListPage: fromProjectListPageReducer.State;
}

export interface State extends fromRoot.State {
  projectListPage: ProjectListPageStateMain;
}

export const reducers = {
  projectListPage: fromProjectListPageReducer.reducer
};

export const selectProjectListPageMainState =
    createFeatureSelector<ProjectListPageStateMain>('projectListPageMain');

export const selectProjectListPageState =
    createSelector(selectProjectListPageMainState, (state: ProjectListPageStateMain) => state.projectListPage);
