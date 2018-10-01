import * as fromUserContextActions from '../actions/user-context.actions';
import { UserContext } from '../models/user-context.model';

export interface State {
    userContext: UserContext;
}

const initialState: State = {
    userContext: null
};

export function reducer(state: State = initialState, action: fromUserContextActions.UserContextAction): State {
    switch (action.type) {
        case fromUserContextActions.SET_USER_CONTEXT: {
            return { userContext: action.payload };
        }
        case fromUserContextActions.CLEAR_USER_CONTEXT: {
            return initialState;
        }
        default: {
            return state;
        }
    }
}

export const getUserContext = (state: State) => state.userContext;
