import { SaveFilterModalData } from '../models';
import * as fromSaveFilterModalActions from '../actions/save-filter-modal.actions';

export interface State {
  modalOpen: boolean;
  modalData: SaveFilterModalData;
}

const initialState: State = {
  modalOpen: false,
  modalData: null
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
        modalData: null
      };
    case fromSaveFilterModalActions.SET_MODAL_DATA:
      return {
        ...state,
        modalData: action.payload
      };
    default:
      return state;
  }
}

export const getModalOpen = (state: State) => state.modalOpen;
export const getModalData = (state: State) => state.modalData;


