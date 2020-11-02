import { Action } from '@ngrx/store';

import { TokenStatus, DeliveryResponse } from 'libs/models/payfactors-api/total-rewards/response';

export const REQUEST_TOKEN = '[Total Rewards/Delivery Page] Request Token';
export const REQUEST_TOKEN_SUCCESS = '[Total Rewards/Delivery Page] Request Token Success';
export const REQUEST_TOKEN_ERROR = '[Total Rewards/Delivery Page] Request Token Error';
export const VALIDATE_TOKEN = '[Total Rewards/Delivery Page] Validate Token';
export const VALIDATE_TOKEN_SUCCESS = '[Total Rewards/Delivery Page] Validate Token Success';
export const VALIDATE_TOKEN_ERROR = '[Total Rewards/Delivery Page] Validate Token Error';
export const START_DOWNLOAD_PDF = '[Total Rewards/Delivery Page] Start Download PDF';
export const START_DOWNLOAD_PDF_SUCCESS = '[Total Rewards/Delivery Page] Start Download PDF Success';
export const START_DOWNLOAD_PDF_ERROR = '[Total Rewards/Delivery Page] Start Download PDF Error';
export const DOWNLOAD_PDF_SUCCESS = '[Total Rewards/Delivery Page] Download PDF Success';
export const DOWNLOAD_PDF_ERROR = '[Total Rewards/Delivery Page] Download PDF Error';

export class RequestToken implements Action {
  readonly type = REQUEST_TOKEN;
  constructor(public payload: { resend: boolean, suppressEmail: boolean }) {}
}

export class RequestTokenSuccess implements Action {
  readonly type = REQUEST_TOKEN_SUCCESS;
  constructor(public payload: { tokenStatus: TokenStatus, resent: boolean, lockedUntil?: Date }) {}
}

export class RequestTokenError implements Action {
  readonly type = REQUEST_TOKEN_ERROR;
  constructor() {}
}

export class ValidateToken implements Action {
  readonly type = VALIDATE_TOKEN;
  constructor(public payload: string) { }
}

export class ValidateTokenSuccess implements Action {
  readonly type = VALIDATE_TOKEN_SUCCESS;
  constructor(public payload: DeliveryResponse) {}
}

export class ValidateTokenError implements Action {
  readonly type = VALIDATE_TOKEN_ERROR;
  constructor() {}
}

export class StartDownloadPdf implements Action {
  readonly type = START_DOWNLOAD_PDF;
  constructor() {}
}

export class StartDownloadPdfSuccess implements Action {
  readonly type = START_DOWNLOAD_PDF_SUCCESS;
  constructor() {}
}

export class StartDownloadPdfError implements Action {
  readonly type = START_DOWNLOAD_PDF_ERROR;
  constructor() {}
}

export class DownloadPdfSuccess implements Action {
  readonly type = DOWNLOAD_PDF_SUCCESS;
  constructor(public payload: string) {}
}

export class DownloadPdfError implements Action {
  readonly type = DOWNLOAD_PDF_ERROR;
  constructor() {}
}

export type VerificationPageActions =
  RequestToken |
  RequestTokenSuccess |
  RequestTokenError |
  ValidateToken |
  ValidateTokenSuccess |
  ValidateTokenError |
  StartDownloadPdf |
  StartDownloadPdfSuccess |
  StartDownloadPdfError |
  DownloadPdfSuccess |
  DownloadPdfError;
