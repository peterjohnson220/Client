import * as fromLoginActions from '../actions/login.actions';

export interface State {
    isLoggingIn: boolean;
    loginSuccess: boolean;
    loginFailure: boolean;
}

const initialState: State = {
    isLoggingIn: false,
    loginSuccess: false,
    loginFailure: false
};

export function reducer(state: State = initialState, action: fromLoginActions.LoginAction): State {
    switch (action.type) {
        case fromLoginActions.LOGIN: {
            return {
                isLoggingIn: true,
                loginSuccess: false,
                loginFailure: false
            };
        }
        case fromLoginActions.LOGIN_SUCCESS: {
            return {
                isLoggingIn: false,
                loginSuccess: true,
                loginFailure: false
            };
        }
        case fromLoginActions.LOGIN_FAILURE: {
            return {
                isLoggingIn: false,
                loginSuccess: false,
                loginFailure: true
            };
        }
        default: {
            return state;
        }
    }
}

export const getIsLoggingIn = (state: State) => state.isLoggingIn;
export const getLoginSuccess = (state: State) => state.loginSuccess;
export const getLoginFailure = (state: State) => state.loginFailure;
