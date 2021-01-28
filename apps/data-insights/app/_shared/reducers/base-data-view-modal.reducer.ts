import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { Entity } from 'libs/ui/formula-editor';

import * as fromDataViewModalActions from '../actions/base-data-view-modal.actions';

export interface State {
  baseEntitiesAsync: AsyncStateObj<Entity[]>;
}

export const initialState = {
  baseEntitiesAsync: generateDefaultAsyncStateObj<Entity[]>([])
};

export function reducer(state = initialState, action: fromDataViewModalActions.Actions): State {
  switch (action.type) {
    case fromDataViewModalActions.GET_BASE_ENTITIES: {
      const asyncStateObjClone = cloneDeep(state.baseEntitiesAsync);

      asyncStateObjClone.loading = true;
      asyncStateObjClone.loadingError = false;
      return {
        ...state,
        baseEntitiesAsync: asyncStateObjClone
      };
    }
    case fromDataViewModalActions.GET_BASE_ENTITIES_SUCCESS: {
      const asyncStateObjClone = cloneDeep(state.baseEntitiesAsync);
      asyncStateObjClone.loading = false;
      asyncStateObjClone.obj = action.payload;

      return {
        ...state,
        baseEntitiesAsync: asyncStateObjClone
      };
    }
    case fromDataViewModalActions.GET_BASE_ENTITIES_ERROR: {
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
