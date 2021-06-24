import * as fromDuplicateModelModalActions from '../actions/duplicate-model-modal.actions';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';

export interface State {
  modalOpen: boolean;
  duplicatingModelAsyncObj: AsyncStateObj<any>;
  modelNameExistsFailure: boolean;
}

const initialState: State = {
  modalOpen: false,
  duplicatingModelAsyncObj: generateDefaultAsyncStateObj<any>(null),
  modelNameExistsFailure: false
};

export function reducer(state = initialState, action: fromDuplicateModelModalActions.DuplicateModelModalActions): State {
  switch (action.type) {
    case fromDuplicateModelModalActions.OPEN_MODAL:
      return {
        ...state,
        modalOpen: true
      };
    case fromDuplicateModelModalActions.CLOSE_MODAL:
      return {
        ...state,
        modalOpen: false
      };
    case fromDuplicateModelModalActions.DUPLICATE_MODEL:
      return AsyncStateObjHelper.saving(state, 'duplicatingModelAsyncObj');
    case fromDuplicateModelModalActions.DUPLICATE_MODEL_SUCCESS:
      return AsyncStateObjHelper.savingSuccess(state, 'duplicatingModelAsyncObj');
    case fromDuplicateModelModalActions.DUPLICATE_MODEL_ERROR:
      return AsyncStateObjHelper.savingError(state, 'duplicatingModelAsyncObj');
    case fromDuplicateModelModalActions.MODEL_NAME_EXISTS_FAILURE: {
      return {
        ...state,
        modelNameExistsFailure: true,
        duplicatingModelAsyncObj: {...state.duplicatingModelAsyncObj, saving: false}
      };
    }
    case fromDuplicateModelModalActions.CLEAR_MODEL_NAME_EXISTS_FAILURE: {
      return {
        ...state,
        modelNameExistsFailure: false
      };
    }
    default:
      return state;
  }
}

export const getModalOpen = (state: State) => state.modalOpen;
export const getDuplicatingModelAsyncObj = (state: State) => state.duplicatingModelAsyncObj;
export const getDuplicateModelNameExistsFailure = (state: State) => state.modelNameExistsFailure;
