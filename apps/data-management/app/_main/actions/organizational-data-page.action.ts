import { Action } from '@ngrx/store';

export const GET_ORGANIZATIONAL_HEADERS_LINK = '[Data Management / Org Data Load Page] Get Organizational Headers Link';
export const GET_ORGANIZATIONAL_HEADERS_LINK_SUCCESS = '[Data Management / Org Data Load Page] Get Organizational Headers Link Success';
export const GET_ORGANIZATIONAL_HEADERS_LINK_ERROR = '[Data Management / Org Data Load Page] Get Organizational Headers Link Error';
export const SET_MODAL_STATE_OPEN = '[Data Management / Org Data Load Page] Set Modal State';

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

export class SetModalStateOpen implements Action {
  readonly type = SET_MODAL_STATE_OPEN;
  constructor(public payload: boolean) { }
}


export type Actions
  = GetOrganizationalHeadersLink
  | GetOrganizationalHeadersLinkSuccess
  | GetOrganizationalHeadersLinkError
  | SetModalStateOpen;
