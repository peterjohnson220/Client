import { SaveFilterModalData } from '../models';
import * as fromSaveFilterModalActions from '../actions/save-filter-modal.actions';
import { UserFilterUpsertRequest } from 'libs/models/payfactors-api/user-filter';

export interface State {
  modalOpen: boolean;
  modalData: SaveFilterModalData;
  upsertRequest: UserFilterUpsertRequest;
}

const initialState: State = {
  modalOpen: false,
  modalData: null,
  upsertRequest: null
};

export function reducer(state = initialState, action: fromSaveFilterModalActions.Actions): State {
  switch (action.type) {
    case fromSaveFilterModalActions.OPEN_SAVE_MODAL:
      return {
        ...state,
        modalOpen: true
      };
    case fromSaveFilterModalActions.CLOSE_SAVE_MODAL:
      return {
        ...state,
        modalOpen: false,
        modalData: null,
        upsertRequest: null
      };
    case fromSaveFilterModalActions.SET_MODAL_DATA:
      return {
        ...state,
        modalData: action.payload
      };
    case fromSaveFilterModalActions.SET_UPSERT_REQUEST:
      return {
        ...state,
        upsertRequest: action.payload
      };
    default:
      return state;
  }
}

export const getModalOpen = (state: State) => state.modalOpen;
export const getModalData = (state: State) => state.modalData;
export const getUpsertRequest = (state: State) => state.upsertRequest;


