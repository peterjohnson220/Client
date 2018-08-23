import * as fromPeerPermisionActions from '../actions/permissions.actions';

export interface State {
    loading: boolean;
    loadingError: boolean;
    loadingAttempted: boolean;
    exchangeAccess: number[];
}

// Initial State
export const initialState: State = {
    loading: false,
    loadingError: false,
    loadingAttempted: false,
    exchangeAccess: []
};


// Reducer
export function reducer(
    state = initialState,
    action: fromPeerPermisionActions.Actions
): State {
    switch (action.type) {
        case fromPeerPermisionActions.LOAD_ACCESS_PERMISSIONS: {
            return {
                ...state,
                loading: true,
                loadingError: false
            };
        }
        case fromPeerPermisionActions.LOAD_ACCESS_PERMISSIONS_SUCCESS: {
            return {
                ...state,
                exchangeAccess: action.payload,
                loading: false,
                loadingError: false,
                loadingAttempted: true
            };
        }
        case fromPeerPermisionActions.LOAD_ACCESS_PERMISSIONS_ERROR: {
            return {
                ...state,
                loading: false,
                loadingError: true,
                loadingAttempted: true
            };
        }
        default: {
            return state;
        }
    }
}

// Selector Functions
export const getExchangeAccess = (state: State) => state.exchangeAccess;
export const getExchangeAccessLoading = (state: State) => state.loading;
export const getExchangeAccessLoadingAttempted = (state: State) => state.loadingAttempted;
export const getExchangeAccessLoadingError = (state: State) => state.loadingError;
