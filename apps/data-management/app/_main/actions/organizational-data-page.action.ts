import { Action } from '@ngrx/store';



export const GET_ORGANIZATIONAL_HEADERS_LINK = '[Data Management / Org Data Load Page] Get Organizational Headers Link';
export const GET_ORGANIZATIONAL_HEADERS_LINK_SUCCESS = '[Data Management / Org Data Load Page] Get Organizational Headers Link Success';
export const GET_ORGANIZATIONAL_HEADERS_LINK_ERROR = '[Data Management / Org Data Load Page] Get Organizational Headers Link Error';

export class GetOrganizationalHeadersLink implements Action {
  readonly type = GET_ORGANIZATIONAL_HEADERS_LINK;
}

export class GetOrganizationalHeadersLinkSuccess implements Action {
  readonly type = GET_ORGANIZATIONAL_HEADERS_LINK_SUCCESS;

  constructor(public payload: string) { }
}

export class GetOrganizationalHeadersLinkError implements Action {
  readonly type = GET_ORGANIZATIONAL_HEADERS_LINK_ERROR;
}

export type Actions
  = GetOrganizationalHeadersLink
  | GetOrganizationalHeadersLinkSuccess
  | GetOrganizationalHeadersLinkError;
