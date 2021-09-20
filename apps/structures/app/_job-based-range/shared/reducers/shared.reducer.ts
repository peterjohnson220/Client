import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';

import * as fromSharedActions from '../actions/shared.actions';

export interface State {
}

const initialState: State = {
}

export function reducer(state = initialState, action: fromSharedActions.SharedActions): State {
  switch (action.type) {
    default:
      return state;
  }
}
