import * as fromOrganizationalDataPageActions from '../actions/organizational-data-page.action';

export interface State {
  organizationalDataTemplateLink: string;
}

export const initialState: State = {
  organizationalDataTemplateLink: null
};

export function reducer(state = initialState, action: fromOrganizationalDataPageActions.Actions): State {
  switch (action.type) {
    case fromOrganizationalDataPageActions.GET_ORGANIZATIONAL_HEADERS_LINK: {
      return {
        ...state,
        organizationalDataTemplateLink: null
      };
    }
    case fromOrganizationalDataPageActions.GET_ORGANIZATIONAL_HEADERS_LINK_SUCCESS: {
      return {
        ...state,
        organizationalDataTemplateLink: action.payload
      };
    }
    case fromOrganizationalDataPageActions.GET_ORGANIZATIONAL_HEADERS_LINK_ERROR: {
      return {
        ...state,
        organizationalDataTemplateLink: null
      };
    }

    default:
      return state;
  }
}

export const getOrganizationalHeadersLink = (state: State) => state.organizationalDataTemplateLink;
