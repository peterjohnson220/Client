import { Action } from '@ngrx/store';

export const REQUEST_PEER_ACCESS  = '[Legacy Content/Request Peer Access] Request Peer Access';
export const REQUEST_PEER_ACCESS_SUCCESS  = '[Legacy Content/Request Peer Access] Request Peer Access Success';
export const REQUEST_PEER_ACCESS_ERROR  = '[Legacy Content/Request Peer Access] Request Peer Access Error';

export class RequestPeerAccess implements Action {
  readonly type = REQUEST_PEER_ACCESS;
}

export class RequestPeerAccessSuccess implements Action {
  readonly type = REQUEST_PEER_ACCESS_SUCCESS;
}

export class RequestPeerAccessError implements Action {
  readonly type = REQUEST_PEER_ACCESS_ERROR;
}

export type Actions
  = RequestPeerAccess
  | RequestPeerAccessSuccess
  | RequestPeerAccessError;
