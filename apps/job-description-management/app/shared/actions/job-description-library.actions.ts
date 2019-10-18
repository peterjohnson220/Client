import { Action } from '@ngrx/store';

import { JobDescriptionLibraryResult, LibrarySearchRequest, LibrarySearchBucketResponse } from '../models';

export const LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_BY_BUCKET = '[job-description-management/Job Description Library] Load JobDescription Library Bucket Results';
export const LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_BY_BUCKET_SUCCESS
  = '[job-description-management/Job Description Library] Load JobDescription Library Results By Bucket Success';
export const LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_BY_BUCKET_ERROR
  = '[job-description-management/Job Description Library] Load JobDescription Library Results By Bucket Error';
export const LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS = '[job-description-management/Job Description Library] Load JobDescription Library Results';
export const LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_SUCCESS = '[job-description-management/Job Description Library] Load JobDescription Library Results Success';
export const LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_ERROR = '[job-description-management/Job Description Library] Load JobDescription Library Results Error';

export class LoadJobDescriptionLibraryResultsByBucket implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_BY_BUCKET;

  constructor(public payload: LibrarySearchRequest) {
  }
}

export class LoadJobDescriptionLibraryResultsByBucketSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_BY_BUCKET_SUCCESS;

  constructor(public payload: LibrarySearchBucketResponse) {
  }
}

export class LoadJobDescriptionLibraryResultsByBucketError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_BY_BUCKET_ERROR;
}

export class LoadJobDescriptionLibraryResults implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS;

  constructor(public payload: LibrarySearchRequest) {
  }
}

export class LoadJobDescriptionLibraryResultsSuccess implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_SUCCESS;

  constructor(public payload: JobDescriptionLibraryResult[]) {
  }
}

export class LoadJobDescriptionLibraryResultsError implements Action {
  readonly type = LOAD_JOB_DESCRIPTION_LIBRARY_RESULTS_ERROR;
}

export type Actions
  = LoadJobDescriptionLibraryResults
  | LoadJobDescriptionLibraryResultsSuccess
  | LoadJobDescriptionLibraryResultsError
  | LoadJobDescriptionLibraryResultsByBucket
  | LoadJobDescriptionLibraryResultsByBucketSuccess
  | LoadJobDescriptionLibraryResultsByBucketError;



