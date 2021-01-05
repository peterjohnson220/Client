import { Action } from '@ngrx/store';
import { MarketingImageDto } from 'libs/models/marketing/marketing-image-dto.model';

export const GET_MARKETING_IMAGE =  '[Marketing/Marketing-settings] Get marketing image';
export const GET_MARKETING_IMAGE_SUCCESS =  '[Marketing/Marketing-settings] Get marketing image success';
export const GET_MARKETING_IMAGE_ERROR =  '[Marketing/Marketing-settings] Get marketing image error';

export const UPDATING_MARKETING_SETTINGS =  '[Marketing/Marketing-settings] Updating marketing settings';
export const UPDATING_MARKETING_SETTINGS_SUCCESS =  '[Marketing/Marketing-settings] Updating marketing settings success';
export const UPDATING_MARKETING_SETTINGS_ERROR =  '[Marketing/Marketing-settings] Updating marketing settings error';

export const GET_MARKETING_VIDEO_URL =  '[Marketing/Marketing-settings] Get marketing video url';
export const GET_MARKETING_VIDEO_URL_SUCCESS =  '[Marketing/Marketing-settings] Get marketing video url success';
export const GET_MARKETING_VIDEO_URL_ERROR =  '[Marketing/Marketing-settings] Get marketing video url error';

export class GetMarketingImage implements Action {
    readonly type = GET_MARKETING_IMAGE;
  }

export class GetMarketingImageSuccess implements Action {
    readonly type = GET_MARKETING_IMAGE_SUCCESS;
    constructor(public payload: MarketingImageDto) {
    }
  }

export class GetMarketingImageError implements Action {
    readonly type = GET_MARKETING_IMAGE_ERROR;
    constructor(public payload: Error) {}
  }

export class UpdatingMarketingSettings implements Action {
  readonly type = UPDATING_MARKETING_SETTINGS;
  constructor(public payload: any) {
  }
}

export class UpdatingMarketingSettingsSuccess implements Action {
  readonly type = UPDATING_MARKETING_SETTINGS_SUCCESS;
}

export class UpdatingMarketingSettingsError implements Action {
  readonly type = UPDATING_MARKETING_SETTINGS_ERROR;
  constructor(public payload: Error) {}
}

export class GetMarketingVideoUrl implements Action {
  readonly type = GET_MARKETING_VIDEO_URL;
}

export class GetMarketingVideoUrlSuccess implements Action {
  readonly type = GET_MARKETING_VIDEO_URL_SUCCESS;
  constructor(public payload: string) {
  }
}

export class GetMarketingVideoUrlError implements Action {
  readonly type = GET_MARKETING_VIDEO_URL_ERROR;
  constructor(public payload: Error) {}
}

  export type Actions
  = GetMarketingImage
  | GetMarketingImageSuccess
  | GetMarketingImageError
  | UpdatingMarketingSettings
  | UpdatingMarketingSettingsSuccess
  | UpdatingMarketingSettingsError
  | GetMarketingVideoUrl
  | GetMarketingVideoUrlSuccess
  | GetMarketingVideoUrlError;

