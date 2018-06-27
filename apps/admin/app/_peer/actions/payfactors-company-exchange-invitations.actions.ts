import { Action } from '@ngrx/store';
import { GridDataResult } from '@progress/kendo-angular-grid';

export const LOAD_PAYFACTORS_COMPANY_EXCHANGE_INVITATIONS =
  '[Peer Admin/Payfactors Company Exchange Invitations] Load Payfactors Company Exchange Invitations';
export const LOAD_PAYFACTORS_COMPANY_EXCHANGE_INVITATIONS_SUCCESS =
  '[Peer Admin/Payfactors Company Exchange Invitations] Load Payfactors Company Exchange Invitations Success';
export const LOAD_PAYFACTORS_COMPANY_EXCHANGE_INVITATIONS_ERROR =
  '[Peer Admin/Payfactors Company Exchange Invitations] Load Payfactors Company Exchange Invitations Error';

export class LoadPayfactorsCompanyExchangeInvitations implements Action {
  readonly type = LOAD_PAYFACTORS_COMPANY_EXCHANGE_INVITATIONS;

  constructor(public payload: any) {}
}

export class LoadPayfactorsCompanyExchangeInvitationsSuccess implements Action {
  readonly type = LOAD_PAYFACTORS_COMPANY_EXCHANGE_INVITATIONS_SUCCESS;

  constructor(public payload: GridDataResult) {}
}

export class LoadPayfactorsCompanyExchangeInvitationsError implements Action {
  readonly type = LOAD_PAYFACTORS_COMPANY_EXCHANGE_INVITATIONS_ERROR;
}

export type Actions
  = LoadPayfactorsCompanyExchangeInvitations
  | LoadPayfactorsCompanyExchangeInvitationsSuccess
  | LoadPayfactorsCompanyExchangeInvitationsError;
