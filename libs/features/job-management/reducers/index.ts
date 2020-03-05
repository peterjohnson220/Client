import { createFeatureSelector, createSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromJobManagementReducer from './job-management.reducer';

// Feature area state
export interface JobManagementState {
  jobData: fromJobManagementReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  feature_job_management: JobManagementState;
}

// Feature area reducers
export const reducers = {
  jobData: fromJobManagementReducer.reducer
};

// Select Feature Area
export const selectJobManagementState =
  createFeatureSelector<JobManagementState>('feature_job_management');

// View Selectors
export const selectJobDataState =
  createSelector(selectJobManagementState, (state: JobManagementState) => state.jobData);

// User Form
export const getState = createSelector(selectJobDataState, fromJobManagementReducer.getState);
export const getLoading = createSelector(selectJobDataState, fromJobManagementReducer.getLoading);
export const getLoadingJobOptions = createSelector(selectJobDataState, fromJobManagementReducer.getLoadingJobOptions);
export const getShowJobModal = createSelector(selectJobDataState, fromJobManagementReducer.getShowJobModal);
export const getJobId = createSelector(selectJobDataState, fromJobManagementReducer.getJobId);
export const getJobFormData = createSelector(selectJobDataState, fromJobManagementReducer.getJobFormData);
export const getAttachments = createSelector(selectJobDataState, fromJobManagementReducer.getAttachments);
export const getJobFamilies = createSelector(selectJobDataState, fromJobManagementReducer.getJobFamilies);
export const getCompanyFlsaStatuses = createSelector(selectJobDataState, fromJobManagementReducer.getCompanyFlsaStatuses);
export const getCompanyJobUdfs = createSelector(selectJobDataState, fromJobManagementReducer.getCompanyJobUdfs);
export const getSaving = createSelector(selectJobDataState, fromJobManagementReducer.getSaving);
export const getDuplicateJobCodeError = createSelector(selectJobDataState, fromJobManagementReducer.getDuplicateJobCodeError);
export const getErrorMessage = createSelector(selectJobDataState, fromJobManagementReducer.getErrorMessage);

