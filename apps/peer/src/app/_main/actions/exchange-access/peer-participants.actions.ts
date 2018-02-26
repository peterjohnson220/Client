import { Action } from '@ngrx/store';

import { CompanyOption } from 'libs/models/common/index';

export const LOAD_PEER_PARTICIPANTS  = '[Peer Main/Peer Participants] Load Peer Participants';
export const LOAD_PEER_PARTICIPANTS_SUCCESS  = '[Peer Main/Peer Participants] Load Peer Participants Success';
export const LOAD_PEER_PARTICIPANTS_ERROR = '[Peer Main/Available Exchanges] Load Peer Participants Error';

export class LoadPeerParticipants implements Action {
  readonly type = LOAD_PEER_PARTICIPANTS;

  constructor(public payload: any) {}
}

export class LoadPeerParticipantsSuccess implements Action {
  readonly type = LOAD_PEER_PARTICIPANTS_SUCCESS;

  constructor(public payload: CompanyOption[]) {}
}

export class LoadPeerParticipantsError implements Action {
  readonly type = LOAD_PEER_PARTICIPANTS_ERROR;
}

export type Actions
  = LoadPeerParticipants
  | LoadPeerParticipantsSuccess
  | LoadPeerParticipantsError;
