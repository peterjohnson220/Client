
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';

import * as fromOutboundJdmActions from '../actions/outbound-jdm.actions';
import { ConnectionSummary } from '../models';

export interface State {
  summary: AsyncStateObj<ConnectionSummary>;
}

export const initialState: State = {
  summary: generateDefaultAsyncStateObj<ConnectionSummary>(null),
};

export function reducer(state: State = initialState, action: fromOutboundJdmActions.Actions) {
  switch (action.type) {
    case fromOutboundJdmActions.LOAD_CONNECTION_SUMMARY: {
      return AsyncStateObjHelper.loading(state, 'summary');
    }
    case fromOutboundJdmActions.LOAD_CONNECTION_SUMMARY_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'summary', action.payload);
    }
    case fromOutboundJdmActions.LOAD_CONNECTION_SUMMARY_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'summary');
    }
    case fromOutboundJdmActions.SAVE_CONNECTION_SUMMARY: {
      return AsyncStateObjHelper.saving(state, 'summary');
    }
    case fromOutboundJdmActions.SAVE_CONNECTION_SUMMARY_SUCCESS: {
      return AsyncStateObjHelper.savingSuccess(state, 'summary', action.payload);
    }
    case fromOutboundJdmActions.SAVE_CONNECTION_SUMMARY_ERROR: {
      return AsyncStateObjHelper.savingError(state, 'summary');
    }
    default:
      return state;
  }
}

export const getConnectionSummary = (state: State) => state.summary;
