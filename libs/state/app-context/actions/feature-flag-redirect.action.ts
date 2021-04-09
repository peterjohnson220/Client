import { Action } from '@ngrx/store';

import { PageRedirectUrl } from '../../../models/url-redirect/page-redirect-url';
import { UrlRedirectRequest } from '../../../models/url-redirect';

export const GET_USER_REDIRECT_URLS = '[AppContext/Feature Flag Redirect] Get User Redirect Urls';
export const GET_USER_REDIRECT_URLS_SUCCESS = '[AppContext/Feature Flag Redirect] Get User Redirect Urls Success';
export const GET_USER_REDIRECT_URLS_ERROR = '[AppContext/Feature Flag Redirect] Get User Redirect Urls Error';

export class GetUserRedirectUrls implements Action {
  readonly type = GET_USER_REDIRECT_URLS;

  constructor(public payload: UrlRedirectRequest[]) {
  }
}

export class GetUserRedirectUrlsSuccess implements Action {
  readonly type = GET_USER_REDIRECT_URLS_SUCCESS;

  constructor(public payload: PageRedirectUrl[]) {
  }
}

export class GetUserRedirectUrlsError implements Action {
  readonly type = GET_USER_REDIRECT_URLS_ERROR;

  constructor(public payload: any) {
  }
}

export type Actions =
  | GetUserRedirectUrls
  | GetUserRedirectUrlsSuccess
  | GetUserRedirectUrlsError;
