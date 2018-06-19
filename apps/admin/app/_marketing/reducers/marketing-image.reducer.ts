import * as marketingActions from '../actions/marketing-image.actions';
import { MarketingImageDto } from 'libs/models/marketing/marketing-image-dto.model';

export interface State {
  gettingMarketingImage: boolean;
  gettingMarketingImageError: boolean;
  gettingMarketingImageSuccess: boolean;
  marketingImage: MarketingImageDto;
}

export const initialState: State = {
  gettingMarketingImage: false,
  gettingMarketingImageError: false,
  gettingMarketingImageSuccess: false,
  marketingImage: null
};

export function reducer(state = initialState, action: marketingActions.Actions): State {
  switch (action.type) {
    case marketingActions.GET_MARKETING_IMAGE: {
      return {
        ...state,
        gettingMarketingImage: true,
        gettingMarketingImageError: false,
        marketingImage: null
      };
    }
    case marketingActions.GET_MARKETING_IMAGE_SUCCESS: {
      return {
        ...state,
        gettingMarketingImage: false,
        gettingMarketingImageSuccess: true,
        marketingImage: action.payload
      };
    }
    case marketingActions.GET_MARKETING_IMAGE_ERROR: {
      return {
        ...state,
        gettingMarketingImage: false,
        gettingMarketingImageError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getGettingMarketingImage = (state: State) => state.gettingMarketingImage;
export const getGettingMarketingImageError = (state: State) => state.gettingMarketingImageError;
export const getGettingMarketingImageSuccess = (state: State) => state.gettingMarketingImageSuccess;
export const getMarketingImage = (state: State) => state.marketingImage;
