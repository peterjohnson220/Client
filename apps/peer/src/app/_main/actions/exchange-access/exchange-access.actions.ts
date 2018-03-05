import { Action } from '@ngrx/store';

import { RequestExchangeAccessRequest } from 'libs/models/peer/request-exchange-access-request.model';

export const OPEN_EXCHANGE_ACCESS_MODAL  = '[Peer Main/Exchange Access] Exchange Access Modal Open';
export const CLOSE_EXCHANGE_ACCESS_MODAL = '[Peer Main/Exchange Access] Exchange Access Modal Close';
export const EXCHANGE_ACCESS_REQUEST = '[Peer Main/Exchange Access] Exchange Access Request';
export const EXCHANGE_ACCESS_REQUEST_SUCCESS  = '[Peer Main/Exchange Access] Exchange Access Request Success';
export const EXCHANGE_ACCESS_REQUEST_ERROR = '[Peer Main/Exchange Access] Exchange Access Request Error';
export const UPDATE_SEARCH_TERM = '[Peer Main/Exchange Access] Exchange Access Update Search Term';
export const UPDATE_COMPANY_FILTER = '[Peer Main/Exchange Access] Exchange Access Update Company Filter';

export class OpenExchangeAccessModal implements Action {
  readonly type = OPEN_EXCHANGE_ACCESS_MODAL;
  readonly payload = null;
}

export class CloseExchangeAccessModal implements Action {
  readonly type = CLOSE_EXCHANGE_ACCESS_MODAL;
  readonly payload = null;
}

export class ExchangeAccessRequest implements Action {
  readonly type = EXCHANGE_ACCESS_REQUEST;

  constructor(public payload: RequestExchangeAccessRequest) {}
}

export class ExchangeAccessRequestSuccess implements Action {
  readonly type = EXCHANGE_ACCESS_REQUEST_SUCCESS;
  readonly payload = null;
}

export class ExchangeAccessRequestError implements Action {
  readonly type = EXCHANGE_ACCESS_REQUEST_ERROR;
  readonly payload = null;
}

export class UpdateSearchTerm implements Action {
  readonly type = UPDATE_SEARCH_TERM;

  constructor(public payload: string) {}
}

export class UpdateCompanyFilter implements Action {
  readonly type = UPDATE_COMPANY_FILTER;

  constructor(public payload: number) {}
}

export type Actions
  = OpenExchangeAccessModal
  | CloseExchangeAccessModal
  | ExchangeAccessRequest
  | ExchangeAccessRequestSuccess
  | ExchangeAccessRequestError
  | UpdateSearchTerm
  | UpdateCompanyFilter;
