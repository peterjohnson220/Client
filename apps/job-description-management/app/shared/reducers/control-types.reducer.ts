import * as cloneDeep from 'lodash.clonedeep';

import { ControlType } from 'libs/models/common';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromControlTypes from '../../shared/actions/control-types.actions';

export interface State {
  controlTypesAsync: AsyncStateObj<ControlType[]>;
}

const initialState: State = {
  controlTypesAsync: generateDefaultAsyncStateObj<ControlType[]>([])
};

export function reducer(state = initialState, action: fromControlTypes.Actions): State {
  switch (action.type) {
    case fromControlTypes.LOAD_CONTROL_TYPES: {
      const controlTypeAsyncClone = cloneDeep(state.controlTypesAsync);

      controlTypeAsyncClone.loading = true;
      controlTypeAsyncClone.loadingError = false;

      return {
        ...state,
        controlTypesAsync: controlTypeAsyncClone
      };
    }
    case fromControlTypes.LOAD_CONTROL_TYPES_SUCCESS: {
      const controlTypeAsyncClone = cloneDeep(state.controlTypesAsync);

      controlTypeAsyncClone.loading = false;
      controlTypeAsyncClone.obj = action.payload;

      return {
        ...state,
        controlTypesAsync: controlTypeAsyncClone
      };
    }
    default:
      return state;
  }
}

export const getControlTypesLoaded = (state: State) => !state.controlTypesAsync.loading;
export const getControlTypeAndVersion = (state: State) => state.controlTypesAsync.obj;
export const getControlTypeAndVersionAsync = (state: State) => state.controlTypesAsync;


