import * as fromMetaDataActions from '../actions/metadata.actions';

export interface State {
  modelName: string;
  currency: string;
}

const initialState: State = {
  modelName: '',
  currency: ''
};

export function reducer(state = initialState, action: fromMetaDataActions.MetadataActions): State {
  switch (action.type) {
    case fromMetaDataActions.SET_MODEL_NAME:
      return {
        ...state,
        modelName: action.payload
      };
    case fromMetaDataActions.SET_CURRENCY:
      return {
        ...state,
        currency: action.payload
      };
    default:
      return state;
  }
}

export const getModelName = (state: State) => state.modelName;
export const getCurrency = (state: State) => state.currency;
