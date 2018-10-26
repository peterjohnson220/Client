import { Action } from '@ngrx/store';

export const SUBMITTING_COMMUNITY_JOB = '[Community/Job] Submitting Community Job';
export const SUBMITTING_COMMUNITY_JOB_SUCCESS = '[Community/Job] Submitting Community Job Success';
export const SUBMITTING_COMMUNITY_JOB_ERROR = '[Community/Job] Submitting Community Job Error';
export const POST_ANOTHER_COMMUNITY_JOB = '[Community/Job] Post Another Community Job';

export const GETTING_COMMUNITY_JOBS = '[Community/Job] Get Community Jobs';
export const GETTING_COMMUNITY_JOBS_SUCCESS = '[Community/Job] Get Community Jobs Success';
export const GETTING_COMMUNITY_JOBS_ERROR = '[Community/Job] Get Community Jobs Error';

export const SUBMIT_ANOTHER_COMMUNITY_JOB = '[Community/Job] Submit Another Community Job';

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

export class SubmitAnotherCommunityJob implements Action {
  readonly type = SUBMIT_ANOTHER_COMMUNITY_JOB;
}

export type Actions
  =  SubmittingCommunityJob
  | SubmittingCommunityJobSuccess
  | SubmittingCommunityJobError
  | GettingCommunityJobs
  | GettingCommunityJobsSuccess
  | GettingCommunityJobsError
  | SubmitAnotherCommunityJob;
