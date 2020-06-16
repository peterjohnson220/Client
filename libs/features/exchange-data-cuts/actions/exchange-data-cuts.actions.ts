import { Action } from '@ngrx/store';

export const CLEAR_STATE = '[Exchange Data Cuts] Clear State';
export const LOAD_PEER_DATA_CUT = '[Exchange Data Cuts] Load Peer Data Cut';
export const LOAD_PEER_DATA_CUT_SUCCESS = '[Exchange Data Cuts] Load Peer Data Cut Success';
export const GET_EXCHANGE_DATA_CUT_ERROR = '[Exchange Data Cuts] Get Exchange Data Cut Error';

export class LoadPeerDataCut implements Action {
  readonly type = LOAD_PEER_DATA_CUT;
  constructor(public filterGUID: string) { }
}

export class ClearState implements Action {
  readonly type = CLEAR_STATE;
  constructor() { }
}

export class LoadPeerDataCutSuccess implements Action {
  readonly type = LOAD_PEER_DATA_CUT_SUCCESS;
  constructor(public payload: any) { }
}

export class GetExchangeDataCutError  implements Action {
  readonly type = GET_EXCHANGE_DATA_CUT_ERROR;
  constructor() { }
}


export type Actions
  = LoadPeerDataCut
  | LoadPeerDataCutSuccess
  | ClearState
  | GetExchangeDataCutError;
