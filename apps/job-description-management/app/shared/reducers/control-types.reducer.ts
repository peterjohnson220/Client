import {ControlType} from 'libs/models/common';

import * as fromControlTypes from '../../shared/actions/control-types.actions';

export interface State {
  loaded: boolean;
  loading: boolean;
  entities: ControlType[];
}

const initialState: State = {
  loaded: false,
  loading: false,
  entities: []
};

export function reducer(state = initialState, action: fromControlTypes.Actions): State {
  switch (action.type) {
    case fromControlTypes.LOAD_CONTROL_TYPES:
      return {
        ...state,
        entities: [],
        loaded: false,
        loading: true
      };
    case fromControlTypes.LOAD_CONTROL_TYPES_SUCCESS:
      return {
        ...state,
        loaded: true,
        loading: false,
        entities: JSON.parse(action.payload)
      };
    default:
      return state;
  }
}

export const getControlTypesLoaded = (state: State) => state.loaded;
export const getControlTypeAndVersion = (state: State) =>  state.entities;

