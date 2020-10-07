import * as communityAttachmentActions from '../actions/community-attachment.actions';
import cloneDeep from 'lodash/cloneDeep';
import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { CommunityAttachmentModalState, CommunityAttachmentUploadStatus } from 'libs/models';

// Create entity adapter
export const adapter: EntityAdapter<CommunityAttachmentModalState> = createEntityAdapter<CommunityAttachmentModalState>({
  selectId: (attachmentModal: CommunityAttachmentModalState) => attachmentModal.Id
});

export interface State extends EntityState<CommunityAttachmentModalState> {
  currentAttachmentModalState: CommunityAttachmentModalState;
}

const initialState: State = adapter.getInitialState({
  currentAttachmentModalState: null
});

export function reducer(state = initialState, action: communityAttachmentActions.Actions): State {
  switch (action.type) {
    case communityAttachmentActions.OPEN_COMMUNITY_ATTACHMENTS_MODAL: {
      let entity = cloneDeep(state.entities[action.payload]);
      if (!entity) {
        entity = {Id: action.payload, Attachments: [], IsModalOpen: true};
      } else {
        entity.IsModalOpen = true;
      }
      return {
        ...adapter.upsertOne(entity, state),
        currentAttachmentModalState: entity
      };
    }
    case communityAttachmentActions.CLOSE_COMMUNITY_ATTACHMENTS_MODAL: {
      const entity = cloneDeep(state.entities[action.payload]);
      entity.IsModalOpen = false;
      return {
        ...adapter.upsertOne(entity, state),
        currentAttachmentModalState: entity
      };
    }
    case communityAttachmentActions.SAVE_COMMUNITY_ATTACHMENTS_STATE: {
      return {
        ...adapter.upsertOne(action.payload, state),
        currentAttachmentModalState: action.payload
      };
    }
    case communityAttachmentActions.CLEAR_COMMUNITY_ATTACHMENTS_STATE: {
      const entity = cloneDeep(state.entities[action.payload]);
      if (entity) {
        entity.Attachments = [];
      }
      return {
        ...adapter.removeOne(action.payload, state),
        currentAttachmentModalState: entity
      };
    }
    case communityAttachmentActions.ATTACHMENT_SCAN_SUCCESS: {
      const entity = cloneDeep(state.entities[action.attachmentModalId]);
      const attachement = entity.Attachments.find((x) => x.Id === action.attachmentId);
      if (attachement) {attachement.Status = CommunityAttachmentUploadStatus.ScanSucceeded; }
      return {
        ...adapter.upsertOne(entity, state),
        currentAttachmentModalState: entity
      };
    }
    case communityAttachmentActions.ATTACHMENT_SCAN_FAILURE: {
      const entity = cloneDeep(state.entities[action.attachmentModalId]);
      const attachement = entity.Attachments.find((x) => x.Id === action.attachmentId);
      if (attachement) { attachement.Status = CommunityAttachmentUploadStatus.ScanFailed; }
      return {
        ...adapter.upsertOne(entity, state),
        currentAttachmentModalState: entity
      };
    }
    default: {
      return state;
    }
  }
}

export const getCurrentAttachmentModalState = (state: State) => cloneDeep(state.currentAttachmentModalState);
export const getCurrentAttachmentModalOpen = (state: State) => !state.currentAttachmentModalState ? false : state.currentAttachmentModalState.IsModalOpen;
