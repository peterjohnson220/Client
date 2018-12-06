import { Action } from '@ngrx/store';

export const SUBMITTING_COMMUNITY_JOB = '[Community/Job] Submitting Community Job';
export const SUBMITTING_COMMUNITY_JOB_SUCCESS = '[Community/Job] Submitting Community Job Success';
export const SUBMITTING_COMMUNITY_JOB_ERROR = '[Community/Job] Submitting Community Job Error';
export const SUBMIT_ANOTHER_COMMUNITY_JOB = '[Community/Job] Submit Another Community Job';

export const GETTING_COMMUNITY_JOBS = '[Community/Job] Get Community Jobs';
export const GETTING_COMMUNITY_JOBS_SUCCESS = '[Community/Job] Get Community Jobs Success';
export const GETTING_COMMUNITY_JOBS_ERROR = '[Community/Job] Get Community Jobs Error';

export const GETTING_MORE_COMMUNITY_JOBS = '[Community/Job] Get More Community Jobs';
export const GETTING_MORE_COMMUNITY_JOBS_SUCCESS = '[Community/Job] Get More Community Jobs Success';
export const GETTING_MORE_COMMUNITY_JOBS_ERROR = '[Community/Job] Get More Community Jobs Errpr';

export const GETTING_BACK_TO_TOP_COMMUNITY_JOBS = '[Community/Job] Get Back To Top Community Jobs';
export const GETTING_BACK_TO_TOP_COMMUNITY_JOBS_SUCCESS = '[Community/Job] Get Back To Top Community Jobs Success';
export const GETTING_BACK_TO_TOP_COMMUNITY_JOBS_ERROR = '[Community/Job] Get Back To Top Community Jobs Error';

export const DELETING_COMMUNITY_JOB = '[Community/Job] Deleting Community Job';
export const DELETING_COMMUNITY_JOB_SUCCESS = '[Community/Job] Deleting Community Job Success';
export const DELETING_COMMUNITY_JOB_ERROR = '[Community/Job] Deleting Community Job Error';

export class SubmittingCommunityJob implements Action {
  readonly type = SUBMITTING_COMMUNITY_JOB;
  constructor(public payload: any) {}
}

export class SubmittingCommunityJobSuccess implements Action {
  readonly type = SUBMITTING_COMMUNITY_JOB_SUCCESS;
  constructor(public payload: any) {}
}

export class SubmittingCommunityJobError implements Action {
  readonly type = SUBMITTING_COMMUNITY_JOB_ERROR;
}

export class SubmitAnotherCommunityJob implements Action {
  readonly type = SUBMIT_ANOTHER_COMMUNITY_JOB;
}

export class GettingCommunityJobs implements Action {
  readonly type = GETTING_COMMUNITY_JOBS;
}

export class GettingCommunityJobsSuccess implements Action {
  readonly type = GETTING_COMMUNITY_JOBS_SUCCESS;
  constructor(public payload: any) {}
}

export class GettingCommunityJobsError implements Action {
  readonly type = GETTING_COMMUNITY_JOBS_ERROR;
}

export class GettingMoreCommunityJobs implements Action {
  readonly type = GETTING_MORE_COMMUNITY_JOBS;
}

export class GettingMoreCommunityJobsSuccess implements Action {
  readonly type = GETTING_MORE_COMMUNITY_JOBS_SUCCESS;
  constructor(public payload: any) {}
}

export class GettingMoreCommunityJobsError implements Action {
  readonly type = GETTING_MORE_COMMUNITY_JOBS_ERROR;
}

export class GettingBackToTopCommunityJobs implements Action {
  readonly type = GETTING_BACK_TO_TOP_COMMUNITY_JOBS;
}

export class GettingBackToTopCommunityJobsSuccess implements Action {
  readonly type = GETTING_BACK_TO_TOP_COMMUNITY_JOBS_SUCCESS;
  constructor(public payload: any) {}
}

export class GettingBackToTopCommunityJobsError implements Action {
  readonly type = GETTING_BACK_TO_TOP_COMMUNITY_JOBS_ERROR;
}

export class DeletingCommunityJob implements Action {
  readonly type = DELETING_COMMUNITY_JOB;
  constructor(public payload: any) {}
}

export class DeletingCommunityJobSuccess implements Action {
  readonly type = DELETING_COMMUNITY_JOB_SUCCESS;
  constructor(public payload: any) {}
}

export class DeletingCommunityJobError implements Action {
  readonly type = DELETING_COMMUNITY_JOB_ERROR;
}

export type Actions
  =  SubmittingCommunityJob
  | SubmittingCommunityJobSuccess
  | SubmittingCommunityJobError
  | SubmitAnotherCommunityJob
  | GettingCommunityJobs
  | GettingCommunityJobsSuccess
  | GettingCommunityJobsError
  | GettingMoreCommunityJobs
  | GettingMoreCommunityJobsSuccess
  | GettingMoreCommunityJobsError
  | GettingBackToTopCommunityJobs
  | GettingBackToTopCommunityJobsSuccess
  | GettingBackToTopCommunityJobsError
  | DeletingCommunityJob
  | DeletingCommunityJobSuccess
  | DeletingCommunityJobError;
