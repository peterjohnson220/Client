import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOAD_NEW_COMPANY_EXCHANGE_INVITATIONS =
  '[Peer Admin/New Company Exchange Invitations] Load New Company Exchange Invitations';
export const LOAD_NEW_COMPANY_EXCHANGE_INVITATIONS_SUCCESS =
  '[Peer Admin/New Company Exchange Invitations] Load New Company Exchange Invitations Success';
export const LOAD_NEW_COMPANY_EXCHANGE_INVITATIONS_ERROR =
  '[Peer Admin/New Company Exchange Invitations] Load New Company Exchange Invitations Error';

export class LoadNewCompanyExchangeInvitations implements Action {
  readonly type = LOAD_NEW_COMPANY_EXCHANGE_INVITATIONS;

  constructor(public payload: any) {}
}

export class LoadNewCompanyExchangeInvitationsSuccess implements Action {
  readonly type = LOAD_NEW_COMPANY_EXCHANGE_INVITATIONS_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadNewCompanyExchangeInvitationsError implements Action {
  readonly type = LOAD_NEW_COMPANY_EXCHANGE_INVITATIONS_ERROR;
}

export type Actions
  = LoadNewCompanyExchangeInvitations
  | LoadNewCompanyExchangeInvitationsSuccess
  | LoadNewCompanyExchangeInvitationsError;
