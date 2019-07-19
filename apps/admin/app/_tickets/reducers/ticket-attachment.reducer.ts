import {UserTicketAttachmentDeleteRequest} from 'libs/models/payfactors-api/service/request';

import * as fromTicketAttachmentActions from '../actions/ticket-attachment.actions';

export interface State {
  deleteModalOpen: boolean;
  deleteAttachmentRequest: UserTicketAttachmentDeleteRequest;
  deleting: boolean;
  deletingError: boolean;
}

export const initialState: State = {
  deleteModalOpen: false,
  deleteAttachmentRequest: null,
  deleting: false,
  deletingError: false
};

export function reducer(state = initialState, action: fromTicketAttachmentActions.Actions): State {
  switch (action.type) {
    case fromTicketAttachmentActions.DELETE_ATTACHMENT_MODAL_OPEN: {
      return {
        ...state,
        deleteModalOpen: true,
        deletingError: false
      };
    }
    case fromTicketAttachmentActions.DELETE_ATTACHMENT_MODAL_CLOSE: {
      return {
        ...state,
        deleteModalOpen: false,
        deleteAttachmentRequest: null
      };
    }
    case fromTicketAttachmentActions.DELETE_ATTACHMENT: {
      return {
        ...state,
        deleting: true,
        deletingError: false,
        deleteAttachmentRequest: action.payload
      };
    }
    case fromTicketAttachmentActions.DELETE_ATTACHMENT_SUCCESS: {
      return {
        ...state,
        deleting: false,
        deleteModalOpen: false,
        deleteAttachmentRequest: null
      };
    }
    case fromTicketAttachmentActions.DELETE_ATTACHMENT_ERROR: {
      return {
        ...state,
        deleting: false,
        deletingError: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getDeleteAttachmentModalOpen = (state: State) => state.deleteModalOpen;
export const getDeleteAttachmentRequest = (state: State) => state.deleteAttachmentRequest;
export const getDeletingAttachment = (state: State) => state.deleting;
export const getDeletingAttachmentError = (state: State) => state.deletingError;


