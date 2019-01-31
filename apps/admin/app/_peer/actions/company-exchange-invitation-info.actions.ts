import { Action } from '@ngrx/store';

export const APPROVE_COMPANY_EXCHANGE_INVITATION =
  '[Peer Admin/Company Exchange Invitation Info] Approve Company Exchange Invitation';
export const APPROVE_COMPANY_EXCHANGE_INVITATION_SUCCESS =
  '[Peer Admin/Company Exchange Invitation Info] Approve Company Exchange Invitation Success';
export const APPROVE_COMPANY_EXCHANGE_INVITATION_ERROR =
  '[Peer Admin/Company Exchange Invitation Info] Approve Company Exchange Invitation Error';
export const DENY_COMPANY_EXCHANGE_INVITATION =
  '[Peer Admin/Company Exchange Invitation Info] Deny Company Exchange Invitation';
export const DENY_COMPANY_EXCHANGE_INVITATION_SUCCESS =
  '[Peer Admin/Company Exchange Invitation Info] Deny Company Exchange Invitation Success';
export const DENY_COMPANY_EXCHANGE_INVITATION_ERROR =
  '[Peer Admin/Company Exchange Invitation Info] Deny Company Exchange Invitation Error';
export const OPEN_COMPANY_INVITATION_INFO =
  '[Peer Admin/Company Exchange Invitation Info] Open Company Invitation Info';
export const CLOSE_COMPANY_INVITATION_INFO =
  '[Peer Admin/Company Exchange Invitation Info] Close Company Invitation Info';
export const OPEN_COMPANY_INVITATION_APPROVE_MODAL =
  '[Peer Admin/Company Exchange Invitation Info] Open Company Invitation Approve Modal';
export const CLOSE_COMPANY_INVITATION_APPROVE_MODAL =
  '[Peer Admin/Company Exchange Invitation Info] Close Company Invitation Approve Modal';
export const OPEN_COMPANY_INVITATION_DENY_MODAL =
  '[Peer Admin/Company Exchange Invitation Info] Open Company Invitation Deny Modal';
export const CLOSE_COMPANY_INVITATION_DENY_MODAL =
  '[Peer Admin/Company Exchange Invitation Info] Close Company Invitation Deny Modal';

export class ApproveCompanyExchangeInvitation implements Action {
  readonly type = APPROVE_COMPANY_EXCHANGE_INVITATION;

  constructor(public payload: any) {}
}

export class ApproveCompanyExchangeInvitationSuccess implements Action {
  readonly type = APPROVE_COMPANY_EXCHANGE_INVITATION_SUCCESS;
}

export class ApproveCompanyExchangeInvitationError implements Action {
  readonly type = APPROVE_COMPANY_EXCHANGE_INVITATION_ERROR;
}

export class DenyCompanyExchangeInvitation implements Action {
  readonly type = DENY_COMPANY_EXCHANGE_INVITATION;

  constructor(public payload: any) {}
}

export class DenyCompanyExchangeInvitationSuccess implements Action {
  readonly type = DENY_COMPANY_EXCHANGE_INVITATION_SUCCESS;
}

export class DenyCompanyExchangeInvitationError implements Action {
  readonly type = DENY_COMPANY_EXCHANGE_INVITATION_ERROR;
}

export class OpenCompanyInvitationInfo implements Action {
  readonly type = OPEN_COMPANY_INVITATION_INFO;

  constructor(public payload: any) {}
}

export class CloseCompanyInvitationInfo implements Action {
  readonly type = CLOSE_COMPANY_INVITATION_INFO;
}

export class OpenCompanyInvitationApproveModal implements Action {
  readonly type = OPEN_COMPANY_INVITATION_APPROVE_MODAL;
}

export class CloseCompanyInvitationApproveModal implements Action {
  readonly type = CLOSE_COMPANY_INVITATION_APPROVE_MODAL;
}

export class OpenCompanyInvitationDenyModal implements Action {
  readonly type = OPEN_COMPANY_INVITATION_DENY_MODAL;
}

export class CloseCompanyInvitationDenyModal implements Action {
  readonly type = CLOSE_COMPANY_INVITATION_DENY_MODAL;
}

export type Actions
  = ApproveCompanyExchangeInvitation
  | ApproveCompanyExchangeInvitationSuccess
  | ApproveCompanyExchangeInvitationError
  | DenyCompanyExchangeInvitation
  | DenyCompanyExchangeInvitationSuccess
  | DenyCompanyExchangeInvitationError
  | OpenCompanyInvitationInfo
  | CloseCompanyInvitationInfo
  | OpenCompanyInvitationApproveModal
  | CloseCompanyInvitationApproveModal
  | OpenCompanyInvitationDenyModal
  | CloseCompanyInvitationDenyModal;
