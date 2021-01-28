import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';

import * as fromSharedActions from '../actions/shared.actions';

export interface State {
  gradeRangeDetails: AsyncStateObj<any>;
}

const initialState: State = {
  gradeRangeDetails: generateDefaultAsyncStateObj<any>(null)
};

export function reducer(state = initialState, action: fromSharedActions.SharedActions): State {
  switch (action.type) {
    case fromSharedActions.GET_GRADE_RANGE_DETAILS: {
      const gradeRangeDetails = cloneDeep(state.gradeRangeDetails);

      gradeRangeDetails.loading = true;
      gradeRangeDetails.obj = null;
      gradeRangeDetails.loadingError = false;

      return {
        ...state,
        gradeRangeDetails: gradeRangeDetails
      };
    }
    case fromSharedActions.GET_GRADE_RANGE_DETAILS_SUCCESS: {
      const gradeRangeDetails = cloneDeep(state.gradeRangeDetails);

      gradeRangeDetails.loading = false;
      gradeRangeDetails.obj = action.payload;

      return {
        ...state,
        gradeRangeDetails: gradeRangeDetails
      };
    }
    case fromSharedActions.GET_GRADE_RANGE_DETAILS_ERROR: {
      const gradeRangeDetails = cloneDeep(state.gradeRangeDetails);

      gradeRangeDetails.loading = false;
      gradeRangeDetails.loadingError = true;

      return {
        ...state,
        gradeRangeDetails: gradeRangeDetails
      };
    }
    default:
      return state;
  }
}

export const getGradeRangeDetails = (state: State) => state.gradeRangeDetails;



