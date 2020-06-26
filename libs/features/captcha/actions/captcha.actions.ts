import { Action } from '@ngrx/store';

export const LOADED = '[Feature Captcha] Loaded';
export const GET_SITE_KEY = '[Feature Captcha] Get Site Key';
export const GET_SITE_KEY_SUCCESS = '[Feature Captcha] Get Site Key Success';
export const GET_SITE_KEY_ERROR = '[Feature Captcha] Get Site Key Error';

export class Loaded implements Action {
  readonly type = LOADED;
}

export class GetSiteKey implements Action {
  readonly type = GET_SITE_KEY;
}

export class GetSiteKeySuccess implements Action {
  readonly type = GET_SITE_KEY_SUCCESS;

  constructor(public payload: { siteKey: string }) {}
}

export class GetSiteKeyError implements Action {
  readonly type = GET_SITE_KEY_ERROR;
}

export type Actions
  = Loaded
  | GetSiteKey
  | GetSiteKeySuccess
  | GetSiteKeyError;
