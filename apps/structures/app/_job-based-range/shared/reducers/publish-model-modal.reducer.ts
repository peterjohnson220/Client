import * as fromPublishModelModalActions from '../actions/publish-model-modal.actions';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';

export interface State {
  modalOpen: boolean;
  publishingModelAsyncObj: AsyncStateObj<any>;
}

const initialState: State = {
  modalOpen: false,
  publishingModelAsyncObj: generateDefaultAsyncStateObj<any>(null)
};

export function reducer(state = initialState, action: fromPublishModelModalActions.PublishModelModalActions): State {
  switch (action.type) {
    case fromPublishModelModalActions.OPEN_MODAL:
      return {
        ...state,
        modalOpen: true
      };
    case fromPublishModelModalActions.CLOSE_MODAL:
      return {
        ...state,
        modalOpen: false
      };
    case fromPublishModelModalActions.PUBLISH_MODEL:
      return AsyncStateObjHelper.saving(state, 'publishingModelAsyncObj');
    case fromPublishModelModalActions.PUBLISH_MODEL_SUCCESS:
      return AsyncStateObjHelper.savingSuccess(state, 'publishingModelAsyncObj');
    case fromPublishModelModalActions.PUBLISH_MODEL_ERROR:
      return AsyncStateObjHelper.savingError(state, 'publishingModelAsyncObj');
    default:
      return state;
  }
}

export const getModalOpen = (state: State) => state.modalOpen;
export const getPublishingModelAsyncObj = (state: State) => state.publishingModelAsyncObj;
