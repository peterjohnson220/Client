import * as fromOrganizationalDataPageActions from '../actions/organizational-data-page.action';

export interface State {
  organizationalDataTemplateLink: string;
  organizationalDataTemplateLinkError: boolean;
  isModalOpen: boolean;
}

export const initialState: State = {
  organizationalDataTemplateLink: null,
  organizationalDataTemplateLinkError: false,
  isModalOpen: false
};

export function reducer(state = initialState, action: fromOrganizationalDataPageActions.Actions): State {
  switch (action.type) {
    case fromOrganizationalDataPageActions.GET_ORGANIZATIONAL_HEADERS_LINK: {
      return {
        ...state,
        organizationalDataTemplateLink: null,
        organizationalDataTemplateLinkError: false
      };
    }
    case fromOrganizationalDataPageActions.GET_ORGANIZATIONAL_HEADERS_LINK_SUCCESS: {
      return {
        ...state,
        organizationalDataTemplateLink: action.payload,
        organizationalDataTemplateLinkError: false
      };
    }
    case fromOrganizationalDataPageActions.GET_ORGANIZATIONAL_HEADERS_LINK_ERROR: {
      return {
        ...state,
        organizationalDataTemplateLink: null,
        organizationalDataTemplateLinkError: true
      };
    }
    case fromOrganizationalDataPageActions.SET_MODAL_STATE_OPEN: {
      return {
        ...state,
        isModalOpen: action.payload
      };
    }

    default:
      return state;
  }
}

export const getOrganizationalHeadersLink = (state: State) => state.organizationalDataTemplateLink;
export const getOrganizationalHeadersLinkError = (state: State) => state.organizationalDataTemplateLinkError;
export const getModalStateOpen = (state: State) => state.isModalOpen;
