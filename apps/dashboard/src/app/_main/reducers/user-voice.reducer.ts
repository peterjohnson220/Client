import * as fromUserVoiceActions from '../actions/user-voice.actions';
import { UserVoiceLink } from '../../../../../../libs/models/navigation/user-voice-link.model';

export interface State {
  loading: boolean;
  loadingError: boolean;
  userVoiceLink: UserVoiceLink;
}

export const initialState: State = {
  loading: false,
  loadingError: false,
  userVoiceLink: null
};

export function reducer(state = initialState, action: fromUserVoiceActions.Actions): State {
  switch (action.type) {
    case fromUserVoiceActions.LOADING_USER_VOICE: {
      return {
        ...state,
        loading: true,
        loadingError: false,
        userVoiceLink: null
      };
    }
    case fromUserVoiceActions.LOADING_USER_VOICE_SUCCESS: {
      return {
        ...state,
        loading: false,
        userVoiceLink: action.payload
      };
    }
    case fromUserVoiceActions.LOADING_USER_VOICE_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getUserVoiceLink = (state: State) => state.userVoiceLink;
