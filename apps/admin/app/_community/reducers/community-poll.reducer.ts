import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as communityPollActions from '../actions/community-poll.actions';
import { CommunityPollList } from 'libs/models/community/community-poll-list.model';

export interface State extends EntityState<CommunityPollList> {
  loading: boolean;
  loadingError: boolean;
  addingCommunityPoll: boolean;
  addingCommunityPollError: boolean;
  addingCommunityPollSuccess: boolean;
  editingCommunityPoll: boolean;
  editingCommunityPollError: boolean;
  editingCommunityPollSuccess: boolean;
  communityPollModalOpen: boolean;
  communityPollListToEdit: CommunityPollList;
  exportingCommunityPoll: boolean;
  exportingCommunityPollError: boolean;
  exportingCommunityPollSuccess: any;
}

// Create entity adapter
export const adapter: EntityAdapter<CommunityPollList> = createEntityAdapter<CommunityPollList>({
  selectId: (communityPollItem: CommunityPollList) => communityPollItem.CommunityPollId
});

export const initialState: State = adapter.getInitialState ({
  loading: false,
  loadingError: false,
  addingCommunityPoll: false,
  addingCommunityPollError: false,
  addingCommunityPollSuccess: false,
  editingCommunityPoll: false,
  editingCommunityPollError: false,
  editingCommunityPollSuccess: false,
  communityPollModalOpen: false,
  communityPollListToEdit: null,
  exportingCommunityPoll: false,
  exportingCommunityPollError: false,
  exportingCommunityPollSuccess: null
});

// Reducer
export function reducer(state = initialState, action: communityPollActions.Actions): State {
  switch (action.type) {
    case communityPollActions.LOADING_COMMUNITY_POLLS: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case communityPollActions.LOADING_COMMUNITY_POLLS_SUCCESS: {
      return {
        ...adapter.setAll(action.payload, state),
        loading: false
      };
    }
    case communityPollActions.LOADING_COMMUNITY_POLLS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case communityPollActions.ADDING_COMMUNITY_POLL: {
      return {
        ...state,
        addingCommunityPoll: true,
        addingCommunityPollError: false
      };
    }
    case communityPollActions.ADDING_COMMUNITY_POLL_SUCCESS: {
      return {
        ...state,
        addingCommunityPoll: false,
        addingCommunityPollSuccess: true,
        communityPollModalOpen: false
      };
    }
    case communityPollActions.ADDING_COMMUNITY_POLL_ERROR: {
      return {
        ...state,
        addingCommunityPoll: false,
        addingCommunityPollError: true
      };
    }
    case communityPollActions.EDITING_COMMUNITY_POLL: {
      return {
        ...state,
        editingCommunityPoll: true,
        editingCommunityPollError: false
      };
    }
    case communityPollActions.EDITING_COMMUNITY_POLL_SUCCESS: {
      return {
        ...state,
        editingCommunityPoll: false,
        editingCommunityPollSuccess: true,
        communityPollModalOpen: false
      };
    }
    case communityPollActions.EDITING_COMMUNITY_POLL_ERROR: {
      return {
        ...state,
        editingCommunityPoll: false,
        editingCommunityPollError: true
      };
    }
    case communityPollActions.OPEN_COMMUNITY_POLL_MODAL: {
      return {
        ...state,
        communityPollModalOpen: true,
        communityPollListToEdit: action.payload
      };
    }
    case communityPollActions.CLOSE_COMMUNITY_POLL_MODAL: {
      return {
        ...state,
        communityPollModalOpen: false,
        communityPollListToEdit: null
      };
    }
    case communityPollActions.EXPORTING_COMMUNITY_POLL: {
      return {
        ...state,
        exportingCommunityPoll: true
      };
    }
    case communityPollActions.EXPORTING_COMMUNITY_POLL_SUCCESS: {
      return {
        ...state,
        exportingCommunityPoll: false,
        exportingCommunityPollSuccess: action.payload,
        exportingCommunityPollError: false
      };
    }
    case communityPollActions.EXPORTING_COMMUNITY_POLL_ERROR: {
      return {
        ...state,
        exportingCommunityPoll: false,
        exportingCommunityPollSuccess: null,
        exportingCommunityPollError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getAddingCommunityPoll = (state: State) => state.addingCommunityPoll;
export const getAddingCommunityPollError = (state: State) => state.addingCommunityPollError;
export const getAddingCommunityPollSuccess = (state: State) => state.addingCommunityPollSuccess;
export const getEditingCommunityPoll = (state: State) => state.editingCommunityPoll;
export const getEditingCommunityPollError = (state: State) => state.editingCommunityPollError;
export const getEditingCommunityPollSuccess = (state: State) => state.editingCommunityPollSuccess;
export const getCommunityPollModalOpen = (state: State) => state.communityPollModalOpen;
export const getCommunityPollListToEdit = (state: State) => state.communityPollListToEdit;
export const getExportingCommunityPoll = (state: State) => state.exportingCommunityPoll;
export const getExportingCommunityPollError = (state: State) => state.exportingCommunityPollError;
export const getExportingCommunityPollSuccess = (state: State) => state.exportingCommunityPollSuccess;

