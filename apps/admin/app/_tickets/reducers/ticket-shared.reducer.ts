import * as fromTicketSharedAction from '../actions/ticket-shared.actions';

export interface State {
    isUserDetailModalOpen: boolean;
    isLoadingDetails: boolean;
    userDetail: any;
    hasLoadingError: boolean;
}

export const initialState: State = {
    isUserDetailModalOpen: false,
    isLoadingDetails: false,
    userDetail: null,
    hasLoadingError: false
};


export function reducer(state = initialState, action: fromTicketSharedAction.Actions): State {
    switch (action.type) {
        case fromTicketSharedAction.USER_DETAIL_MODAL_OPEN: {
            return {
                ...state,
                isUserDetailModalOpen: action.payload
            };
        }

        case fromTicketSharedAction.GET_USER_DETAIL: {
            return {
                ...state,
                userDetail: null,
                hasLoadingError: false,
                isLoadingDetails: true
            };
        }

        case fromTicketSharedAction.GET_USER_DETAIL_SUCCESS: {
            return {
                ...state,
                userDetail: { userDetails: action.userdetails, ticketId: action.ticketId },
                hasLoadingError: false,
                isLoadingDetails: false
            };
        }
        case fromTicketSharedAction.GET_USER_DETAIL_FAILED: {
            return {
                ...state,
                userDetail: null,
                hasLoadingError: true,
                isLoadingDetails: false
            };
        }
        default: {
            return state;
        }
    }
}

export const isUserDetailModalOpen = (state: State) => state.isUserDetailModalOpen;
export const getUserDetail = (state: State) => state.userDetail;
export const isLoadingUserDetial = (state: State) => state.isLoadingDetails;
export const hasLoadingError = (state: State) => state.hasLoadingError;
