import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromDataViewActions from '../actions/data-view.actions';
import { Entity } from '../models';

export interface State {
  baseEntitiesAsync: AsyncStateObj<Entity[]>;
}

const initialState: State = {
  baseEntitiesAsync: generateDefaultAsyncStateObj<Entity[]>([])
};

export function reducer(state = initialState, action: fromDataViewActions.Actions): State {
  switch (action.type) {
    case fromDataViewActions.GET_BASE_ENTITIES: {
      const asyncStateObjClone = cloneDeep(state.baseEntitiesAsync);

      asyncStateObjClone.loading = true;
      asyncStateObjClone.loadingError = false;
      return {
        ...state,
        baseEntitiesAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.GET_BASE_ENTITIES_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.baseEntitiesAsync);
      asyncStateObjClone.loading = false;
      asyncStateObjClone.obj = action.payload;

      return {
        ...state,
        baseEntitiesAsync: asyncStateObjClone
      };
    }
    case fromDataViewActions.GET_BASE_ENTITIES_ERROR: {
      const asyncStateObjClone = cloneDeep(state.baseEntitiesAsync);

      asyncStateObjClone.loading = false;
      asyncStateObjClone.loadingError = true;
      return {
        ...state,
        baseEntitiesAsync: asyncStateObjClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getBaseEntitiesAsync = (state: State) => state.baseEntitiesAsync;
