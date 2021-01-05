import { Action } from '@ngrx/store';

export const REQUEST_PEER_ACCESS  = '[Upsert Peer Data Cut/Request Peer Access] Request Peer Access';
export const REQUEST_PEER_ACCESS_SUCCESS  = '[Upsert Peer Data Cut/Request Peer Access] Request Peer Access Success';
export const REQUEST_PEER_ACCESS_ERROR  = '[Upsert Peer Data Cut/Request Peer Access] Request Peer Access Error';

export class RequestPeerAccess implements Action {
  readonly type = REQUEST_PEER_ACCESS;
}

export class RequestPeerAccessSuccess implements Action {
  readonly type = REQUEST_PEER_ACCESS_SUCCESS;
}

export class RequestPeerAccessError implements Action {
  readonly type = REQUEST_PEER_ACCESS_ERROR;
}

export type RequestPeerAccessActions
  = RequestPeerAccess
  | RequestPeerAccessSuccess
  | RequestPeerAccessError;
