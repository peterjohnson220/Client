import * as marketingActions from '../actions/marketing-settings.actions';
import { MarketingImageDto } from 'libs/models/marketing/marketing-image-dto.model';

export interface State {
  gettingMarketingImage: boolean;
  gettingMarketingImageError: boolean;
  gettingMarketingImageSuccess: boolean;
  marketingImage: MarketingImageDto;
  updatingMarketingSettings: boolean;
  updatingMarketingSettingsSuccess: boolean;
  updatingMarketingSettingsError: boolean;
  gettingMarketingVideoUrl: boolean;
  gettingMarketingVideoUrlSuccess: boolean;
  gettingMarketingVideoUrlError: boolean;
  marketingVideoUrl: string;
}

export const initialState: State = {
  gettingMarketingImage: false,
  gettingMarketingImageError: false,
  gettingMarketingImageSuccess: false,
  marketingImage: null,
  updatingMarketingSettings: false,
  updatingMarketingSettingsSuccess: false,
  updatingMarketingSettingsError: false,
  gettingMarketingVideoUrl: false,
  gettingMarketingVideoUrlSuccess: false,
  gettingMarketingVideoUrlError: false,
  marketingVideoUrl: null
};

export function reducer(state = initialState, action: marketingActions.Actions): State {
  switch (action.type) {
    case marketingActions.GET_MARKETING_IMAGE: {
      return {
        ...state,
        gettingMarketingImage: true,
        gettingMarketingImageSuccess: false,
        gettingMarketingImageError: false,
        marketingImage: null
      };
    }
    case marketingActions.GET_MARKETING_IMAGE_SUCCESS: {
      return {
        ...state,
        gettingMarketingImage: false,
        gettingMarketingImageSuccess: true,
        gettingMarketingImageError: false,
        marketingImage: action.payload
      };
    }
    case marketingActions.GET_MARKETING_IMAGE_ERROR: {
      return {
        ...state,
        gettingMarketingImage: false,
        gettingMarketingImageSuccess: false,
        gettingMarketingImageError: true,
        marketingImage: null
      };
    }
    case marketingActions.UPDATING_MARKETING_SETTINGS: {
      return {
        ...state,
        updatingMarketingSettings: true,
        updatingMarketingSettingsSuccess: false,
        updatingMarketingSettingsError: false
      };
    }
    case marketingActions.UPDATING_MARKETING_SETTINGS_SUCCESS: {
      return {
        ...state,
        updatingMarketingSettings: false,
        updatingMarketingSettingsSuccess: true,
        updatingMarketingSettingsError: false
      };
    }
    case marketingActions.UPDATING_MARKETING_SETTINGS_ERROR: {
      return {
        ...state,
        updatingMarketingSettings: false,
        updatingMarketingSettingsSuccess: false,
        updatingMarketingSettingsError: true
      };
    }
    case marketingActions.GET_MARKETING_VIDEO_URL: {
      return {
        ...state,
        gettingMarketingVideoUrl: true,
        gettingMarketingVideoUrlSuccess: false,
        gettingMarketingVideoUrlError: false,
        marketingVideoUrl: null
      };
    }
    case marketingActions.GET_MARKETING_VIDEO_URL_SUCCESS: {
      return {
        ...state,
        gettingMarketingVideoUrl: false,
        gettingMarketingVideoUrlSuccess: true,
        gettingMarketingVideoUrlError: false,
        marketingVideoUrl: action.payload
      };
    }
    case marketingActions.GET_MARKETING_VIDEO_URL_ERROR: {
      return {
        ...state,
        gettingMarketingVideoUrl: false,
        gettingMarketingVideoUrlSuccess: false,
        gettingMarketingVideoUrlError: true,
        marketingVideoUrl: null
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
export const getUpdatingMarketingSettings = (state: State) => state.updatingMarketingSettings;
export const getUpdatingMarketingSettingsSuccess = (state: State) => state.updatingMarketingSettingsSuccess;
export const getUpdatingMarketingSettingsError = (state: State) => state.updatingMarketingSettingsError;
export const getGettingMarketingVideoUrl = (state: State) => state.gettingMarketingVideoUrl;
export const getGettingMarketingVideoUrlError = (state: State) => state.gettingMarketingVideoUrlError;
export const getGettingMarketingVideoUrlSuccess = (state: State) => state.gettingMarketingVideoUrlSuccess;
export const getMarketingVideoUrl = (state: State) => state.marketingVideoUrl;

