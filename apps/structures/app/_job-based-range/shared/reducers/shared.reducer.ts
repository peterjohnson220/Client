import * as fromSharedActions from '../actions/shared.actions';
import { RangeGroupMetadata } from '../models';

export interface State {
  metadata: RangeGroupMetadata;
}

const initialState: State = {
  metadata: null
};

export function reducer(state = initialState, action: fromSharedActions.SharedActions): State {
  switch (action.type) {
    case fromSharedActions.SET_METADATA:
      return {
        ...state,
        metadata: action.payload
      };
    default:
      return state;
  }
}

export const getMetadata = (state: State) => state.metadata;
