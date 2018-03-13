import { Action } from '@ngrx/store';

export enum ExchangeRequestTypeEnum {
  NewExchange,
  Access,
  ReferPayfactorsCompany,
  ReferNewCompany,
  PayfactorsJob,
  NewJob
}

export class ExchangeRequestAction implements Action {
  readonly type: string;
  readonly exchangeRequestType: ExchangeRequestTypeEnum;
}
export const LOAD_CANDIDATES = '[Peer Main/Exchange Request] Load Candidates';
export const LOAD_CANDIDATES_SUCCESS = '[Peer Main/Exchange Request] Load Candidates Success';
export const LOAD_CANDIDATES_ERROR = '[Peer Main/Exchange Request] Load Candidates Error';
export const OPEN_EXCHANGE_REQUEST_MODAL  = '[Peer Main/Exchange Request] Open Exchange Request Modal';
export const CLOSE_EXCHANGE_REQUEST_MODAL = '[Peer Main/Exchange Request] Close Exchange Request Modal';
export const CREATE_EXCHANGE_REQUEST = '[Peer Main/Exchange Request] Create Exchange Request';
export const CREATE_EXCHANGE_REQUEST_SUCCESS = '[Peer Main/Exchange Request] Create Exchange Request Success';
export const CREATE_EXCHANGE_REQUEST_ERROR = '[Peer Main/Exchange Request] Create Exchange Request Error';
export const UPDATE_SELECTION = '[Peer Main/Exchange Request] Update Selection';
export const UPDATE_SEARCH_TERM = '[Peer Main/Exchange Request] Update Search Term';
export const UPDATE_FILTER_OPTIONS = '[Peer Main/Exchange Request] Update Filter Options';
export const RESET_EXCHANGE_REQUEST = '[Peer Main/Exchange Request] Reset Exchange Request';

export class LoadCandidates implements ExchangeRequestAction {
  readonly type: string;
  readonly payload = null;

  constructor(public exchangeRequestType: ExchangeRequestTypeEnum) {
    this.type = `${exchangeRequestType}_${LOAD_CANDIDATES}`;
  }
}

export class LoadCandidatesSuccess implements ExchangeRequestAction {
  readonly type: string;

  constructor(public exchangeRequestType: ExchangeRequestTypeEnum, public payload: any) {
    this.type = `${exchangeRequestType}_${LOAD_CANDIDATES_SUCCESS}`;
  }
}

export class LoadCandidatesError implements ExchangeRequestAction {
  readonly type: string;
  readonly payload = null;

  constructor(public exchangeRequestType: ExchangeRequestTypeEnum) {
    this.type = `${exchangeRequestType}_${LOAD_CANDIDATES_ERROR}`;
  }
}
export class OpenExchangeRequestModal implements ExchangeRequestAction {
  readonly type: string;
  readonly payload = null;

  constructor(public exchangeRequestType: ExchangeRequestTypeEnum) {
    this.type = `${exchangeRequestType}_${OPEN_EXCHANGE_REQUEST_MODAL}`;
  }
}

export class CloseExchangeRequestModal implements ExchangeRequestAction {
  readonly type: string;
  readonly payload = null;

  constructor(public exchangeRequestType: ExchangeRequestTypeEnum) {
    this.type = `${exchangeRequestType}_${CLOSE_EXCHANGE_REQUEST_MODAL}`;
  }
}

export class CreateExchangeRequest implements ExchangeRequestAction {
  readonly type: string;

  constructor(public exchangeRequestType: ExchangeRequestTypeEnum, public payload: any) {
    this.type = `${exchangeRequestType}_${CREATE_EXCHANGE_REQUEST}`;
  }
}

export class CreateExchangeRequestSuccess implements ExchangeRequestAction {
  readonly type: string;

  constructor(public exchangeRequestType: ExchangeRequestTypeEnum, public payload: any) {
    this.type = `${exchangeRequestType}_${CREATE_EXCHANGE_REQUEST_SUCCESS}`;
  }
}

export class CreateExchangeRequestError implements ExchangeRequestAction {
  readonly type: string;
  readonly payload = null;

  constructor(public exchangeRequestType: ExchangeRequestTypeEnum) {
    this.type = `${exchangeRequestType}_${CREATE_EXCHANGE_REQUEST_ERROR}`;
  }
}

export class UpdateSelection implements ExchangeRequestAction {
  readonly type: string;

  constructor(public exchangeRequestType: ExchangeRequestTypeEnum, public payload: any) {
    this.type = `${exchangeRequestType}_${UPDATE_SELECTION}`;
  }
}

export class UpdateSearchTerm implements ExchangeRequestAction {
  readonly type: string;

  constructor(public exchangeRequestType: ExchangeRequestTypeEnum, public payload: string) {
    this.type = `${exchangeRequestType}_${UPDATE_SEARCH_TERM}`;
  }
}

export class UpdateFilterOptions implements ExchangeRequestAction {
  readonly type: string;

  constructor(public exchangeRequestType: ExchangeRequestTypeEnum, public payload: any) {
    this.type = `${exchangeRequestType}_${UPDATE_FILTER_OPTIONS}`;
  }
}

export class ResetExchangeRequest implements ExchangeRequestAction {
  readonly type: string;
  readonly payload = null;

  constructor(public exchangeRequestType: ExchangeRequestTypeEnum) {
    this.type = `${exchangeRequestType}_${RESET_EXCHANGE_REQUEST}`;
  }
}

export type ExchangeRequestActions = LoadCandidates
  | LoadCandidatesSuccess
  | LoadCandidatesError
  | OpenExchangeRequestModal
  | CloseExchangeRequestModal
  | CreateExchangeRequest
  | CreateExchangeRequestSuccess
  | CreateExchangeRequestError
  | UpdateSelection
  | UpdateSearchTerm
  | UpdateFilterOptions
  | ResetExchangeRequest;
