import { Action } from '@ngrx/store';
import { MarketingImageDto } from 'libs/models/marketing/marketing-image-dto.model';

export const GET_MARKETING_IMAGE =  '[marketing/marketing-image] Get marketing image';
export const GET_MARKETING_IMAGE_SUCCESS =  '[marketing/marketing-image] Get marketing image success';
export const GET_MARKETING_IMAGE_ERROR =  '[marketing/marketing-image] Get marketing image error';

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

  export type Actions
  = GetMarketingImage
  | GetMarketingImageSuccess
  | GetMarketingImageError;

