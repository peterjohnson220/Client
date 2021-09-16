import * as fromAddGradeModalActions from '../actions/add-grade-modal.actions';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';

export interface State {
  modalOpen: boolean;
  addingGradeAsyncObj: AsyncStateObj<any>;
  gradeNameExistsFailure: boolean;
}

const initialState: State = {
  modalOpen: false,
  addingGradeAsyncObj: generateDefaultAsyncStateObj<any>(null),
  gradeNameExistsFailure: false
};

export function reducer(state = initialState, action: fromAddGradeModalActions.AddGradeModalActions): State {
  switch (action.type) {
    case fromAddGradeModalActions.OPEN_MODAL:
      return {
        ...state,
        modalOpen: true
      };
    case fromAddGradeModalActions.CLOSE_MODAL:
      return {
        ...state,
        modalOpen: false
      };
    case fromAddGradeModalActions.ADD_GRADE:
      return AsyncStateObjHelper.saving(state, 'addingGradeAsyncObj');
    case fromAddGradeModalActions.ADD_GRADE_SUCCESS:
      return AsyncStateObjHelper.savingSuccess(state, 'addingGradeAsyncObj');
    case fromAddGradeModalActions.ADD_GRADE_ERROR:
      return AsyncStateObjHelper.savingError(state, 'addingGradeAsyncObj');
    case fromAddGradeModalActions.GRADE_NAME_EXISTS_FAILURE: {
      return {
        ...state,
        gradeNameExistsFailure: true,
        addingGradeAsyncObj: {...state.addingGradeAsyncObj, saving: false}
      };
    }
    case fromAddGradeModalActions.CLEAR_GRADE_NAME_EXISTS_FAILURE: {
      return {
        ...state,
        gradeNameExistsFailure: false
      };
    }
    default:
      return state;
  }
}

export const getModalOpen = (state: State) => state.modalOpen;
export const getAddingGradeAsyncObj = (state: State) => state.addingGradeAsyncObj;
export const getGradeNameExistsFailure = (state: State) => state.gradeNameExistsFailure;