import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { FormSubmissionResponse } from 'libs/models/payfactors-api/form';

import * as fromSharedActions from '../actions/shared.actions';

export interface State {
  submittingFormAsyncObj: AsyncStateObj<FormSubmissionResponse>;
  rootFormModelValue: any;
}

const initialState: State = {
  submittingFormAsyncObj: generateDefaultAsyncStateObj<FormSubmissionResponse>(null),
  rootFormModelValue: null
};

export function reducer(state = initialState, action: fromSharedActions.SharedActions): State {
  switch (action.type) {
    case fromSharedActions.SUBMIT_FORM:
      return AsyncStateObjHelper.saving(state, 'submittingFormAsyncObj');
    case fromSharedActions.SUBMIT_FORM_SUCCESS:
      return AsyncStateObjHelper.savingSuccess(state, 'submittingFormAsyncObj', action.payload.formSubmissionResponse);
    case fromSharedActions.SUBMIT_FORM_ERROR:
      return AsyncStateObjHelper.savingError(state, 'submittingFormAsyncObj');
    case fromSharedActions.FORM_UPDATE:
        return {
          ...state,
          rootFormModelValue: action.payload.rootFormModelValue
        };
    default:
      return state;
  }
}

export const getSubmittingFormAsyncObj = (state: State) => state.submittingFormAsyncObj;
export const getRootFormModelValue = (state: State) => state.rootFormModelValue;
