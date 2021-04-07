import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import * as fromSwitchRegressionFlagModalActions from '../actions/switch-regression-flags-modal.actions';
import { GradePoint } from '../models';

export interface State {
  modalOpen: boolean;
  switchRegressionFlagsAsyncObj: AsyncStateObj<any>;
  gradePoints: GradePoint[];
}

const initialState: State = {
  modalOpen: false,
  switchRegressionFlagsAsyncObj: generateDefaultAsyncStateObj<any>(null),
  gradePoints: []
};

export function reducer(state = initialState, action: fromSwitchRegressionFlagModalActions.SwitchRegressionFlagsModalActions): State {
  switch (action.type) {
    case fromSwitchRegressionFlagModalActions.OPEN_MODAL:
      return {
        ...state,
        modalOpen: true
      };
    case fromSwitchRegressionFlagModalActions.CLOSE_MODAL:
      return {
        ...state,
        modalOpen: false
      };
    case fromSwitchRegressionFlagModalActions.SWITCH_REGRESSION_FLAGS:
      return AsyncStateObjHelper.saving(state, 'switchRegressionFlagsAsyncObj');
    case fromSwitchRegressionFlagModalActions.SWITCH_REGRESSION_FLAGS_SUCCESS:
      return AsyncStateObjHelper.savingSuccess(state, 'switchRegressionFlagsAsyncObj');
    case fromSwitchRegressionFlagModalActions.SWITCH_REGRESSION_FLAGS_ERROR:
      return AsyncStateObjHelper.savingError(state, 'switchRegressionFlagsAsyncObj');
    case fromSwitchRegressionFlagModalActions.SET_GRADE_POINTS:
      return {
        ...state,
        gradePoints: action.payload
      };
    default:
      return state;
  }
}

export const getModalOpen = (state: State) => state.modalOpen;
export const getSwitchRegressionFlagsAsyncObj = (state: State) => state.switchRegressionFlagsAsyncObj;
export const getGradePoints = (state: State) => state.gradePoints;
