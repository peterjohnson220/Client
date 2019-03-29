import * as fromDataAccessTabActions from '../actions/data-access-tab.action';
import {DataType} from 'libs/models/security/roles/data-type';

export interface State {
  dataTypes: DataType[];
}

export const initialState: State = {
  dataTypes: undefined
};

export function reducer(state = initialState, action: fromDataAccessTabActions.DataAccessTabAction): State {
  switch (action.type) {
    case fromDataAccessTabActions.LOADED_DATA_TYPES:

      return {
        ...state,
        dataTypes: action.payload
      };
    default: {
      return state;
    }
  }
}
export const getDataTypes =  (state: State) => state.dataTypes;

