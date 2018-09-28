import * as fromPeerImportActions from '../actions/import.actions';

export interface State {
    isOpen: boolean;
    importStatus: fromPeerImportActions.ImportStatusEnum;
}

// Initial State
export const initialState: State = {
    isOpen: false,
    importStatus: fromPeerImportActions.ImportStatusEnum.Idle
};

// Reducer
export function reducer(state = initialState, action: fromPeerImportActions.Actions): State {
    switch (action.type) {
        case fromPeerImportActions.SWITCH_ASSOCIATION_IMPORT_MODAL_OPEN: {
            return {
                ...state,
                isOpen: action.payload
            };
        }
        case fromPeerImportActions.SWITCH_ASSOCIATION_IMPORT_STATUS: {
            return {
                ...state,
                importStatus: action.payload
            };
        }
        default: {
            return state;
        }
    }
}

export const getModalIsOpen = (state: State) => state.isOpen;
export const getImportStatus = (state: State) => state.importStatus;
