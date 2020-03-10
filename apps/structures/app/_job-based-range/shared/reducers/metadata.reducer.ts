import * as fromMetaDataActions from '../actions/metadata.actions';
import { RangeGroupMetadata } from '../models';

export interface State {
  metadata: RangeGroupMetadata;
}

const initialState: State = {
  metadata: null
};

export function reducer(state = initialState, action: fromMetaDataActions.MetadataActions): State {
  switch (action.type) {
    case fromMetaDataActions.SET_METADATA:
      return {
        ...state,
        metadata: action.payload
      };
    default:
      return state;
  }
}

export const getMetadata = (state: State) => state.metadata;
