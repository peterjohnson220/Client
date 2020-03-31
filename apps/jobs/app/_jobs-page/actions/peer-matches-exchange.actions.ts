import { Action } from '@ngrx/store';

export const LOAD_JOB_PEER_MATCHES = '[Peer Matches] Load Job Peer Matches';
export const LOAD_JOB_PEER_MATCHES_SUCCESS = '[Peer Matches] Load Job Peer Matches Success';

export class LoadJobPeerMatches implements Action {
  readonly type = LOAD_JOB_PEER_MATCHES;
  constructor(public payload: number) {}
}
export class LoadJobPeerMatchesSuccess implements Action {
  readonly type = LOAD_JOB_PEER_MATCHES_SUCCESS;
  constructor(public payload: any) {}
}

export type JobPeerMatchesActions
  = LoadJobPeerMatches
  | LoadJobPeerMatchesSuccess;
