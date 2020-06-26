import { Action } from '@ngrx/store';

import { Feature } from '../models';

export const LOADING_FEATURES =  '[Dashboard/Features] Loading Features';
export const LOADING_FEATURES_SUCCESS =  '[Dashboard/Features] Loading Features Success';
export const LOADING_FEATURES_ERROR =  '[Dashboard/Features] Loading Features Error';
export const SENDING_IN_APP_MARKETING_EMAIL =  '[Dashboard/Features] Sending In-App Marketing Email';
export const SENDING_IN_APP_MARKETING_EMAIL_SUCCESS =  '[Dashboard/Features] Sending In-App Marketing Email Success';
export const SENDING_IN_APP_MARKETING_EMAIL_ERROR =  '[Dashboard/Features] Sending In-App Marketing Email Error';
export const GETTING_DRIFT_USER_ID = '[Dashboard/Features] Getting Drift User Id';
export const GETTING_DRIFT_USER_ID_SUCCESS = '[Dashboard/Features] Getting Drift User Id Success';
export const GETTING_DRIFT_USER_ID_ERROR = '[Dashboard/Features] Getting Drift User Id Error';


export class LoadingFeatures implements Action {
  readonly type = LOADING_FEATURES;
}

export class LoadingFeaturesSuccess implements Action {
  readonly type = LOADING_FEATURES_SUCCESS;

  constructor(public payload: Feature[]) {}
}

export class LoadingFeaturesError implements Action {
  readonly type = LOADING_FEATURES_ERROR;

  constructor(public any: Error) {}
}

export class SendingInAppMarketingEmail implements Action {
  readonly type = SENDING_IN_APP_MARKETING_EMAIL;

  constructor(public payload: any) {}
}

export class SendingInAppMarketingEmailSuccess implements Action {
  readonly type = SENDING_IN_APP_MARKETING_EMAIL_SUCCESS;

  constructor(public payload: any) {}
}

export class SendingInAppMarketingEmailError implements Action {
  readonly type = SENDING_IN_APP_MARKETING_EMAIL_ERROR;

  constructor(public payload: Error) {}
}

export class GettingDriftUserId implements Action {
  readonly type = GETTING_DRIFT_USER_ID;

  constructor(public payload: number) {}
}

export class GettingDriftUserIdSuccess implements Action {
  readonly type = GETTING_DRIFT_USER_ID_SUCCESS;

  constructor(public payload: number) {}
}

export class GettingDriftUserIdError implements Action {
  readonly type = GETTING_DRIFT_USER_ID_ERROR;

  constructor(public payload: Error) {}
}


export type Actions
  = LoadingFeatures
  | LoadingFeaturesSuccess
  | LoadingFeaturesError
  | SendingInAppMarketingEmail
  | SendingInAppMarketingEmailSuccess
  | SendingInAppMarketingEmailError
  | GettingDriftUserId
  | GettingDriftUserIdSuccess
  | GettingDriftUserIdError;
