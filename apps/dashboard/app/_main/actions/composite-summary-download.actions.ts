import { Action } from '@ngrx/store';
import { Params } from '@angular/router';

import { CompositeSummaryDownloadRequest } from 'libs/models/dashboard';

export const FETCH_AUTH_JWT = '[Dashboard/Composite Summary Download] Fetch Authentication JWT';
export const COMPOSITE_SUMMARY_DOWNLOAD = '[Dashboard/Composite Summary Download] Composite Summary Download';

export class FetchAuthJWT implements Action {
  readonly type = FETCH_AUTH_JWT;

  constructor(public payload: Params) {}
}

export class CompositeSummaryDownload implements Action {
  readonly type = COMPOSITE_SUMMARY_DOWNLOAD;

  constructor(public payload: CompositeSummaryDownloadRequest) {}
}

export type Actions =
  FetchAuthJWT |
  CompositeSummaryDownload;
