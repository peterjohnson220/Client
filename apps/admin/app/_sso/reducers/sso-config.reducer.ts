
import * as fromSsoConfigActions from '../actions/sso-config.actions';

export interface State {
  configuring: boolean;
  configuringSuccess: boolean;
  configuringError: boolean;
}

const initialState: State = {
  configuring: false,
  configuringSuccess: false,
  configuringError: false
}

export function reducer(state = initialState, action: fromSsoConfigActions.Actions): State {
  switch(action.type) {
    case fromSsoConfigActions.SSO_CONFIGURE:
      return{
        ...state,
        configuring: true,
        configuringSuccess: false,
        configuringError: false
      };
    case fromSsoConfigActions.SSO_CONFIGURE_SUCCESS:
      return {
        ...state,
        configuring: false,
        configuringSuccess: true,
        configuringError: false
      };
    case fromSsoConfigActions.SSO_CONFIGURE_ERROR:
      return {
        ...state,
        configuring: false,
        configuringSuccess: false,
        configuringError: true
      };
    default:
      return state;
  }
}

export const getSsoConfiguring = (state: State) => state.configuring;
export const getSsoConfiguringSuccess = (state: State) => state.configuringSuccess;
export const getSsoConfiguringError = (state: State) => state.configuringError;
