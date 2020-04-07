import * as fromSharedActions from '../actions/shared.actions';
import { RangeGroupMetadata } from "../models";
import * as fromModelSettingsModalActions from "../actions/model-settings-modal.actions";

export interface State {
  metadata: RangeGroupMetadata;
  isNewModelAddJobs: boolean;
  isNewModelModelSettings: boolean;

}

const initialState: State = {
  metadata: null,
  isNewModelAddJobs: false,
  isNewModelModelSettings: false
};

export function reducer(state = initialState, action: fromSharedActions.SharedActions): State {
  switch (action.type) {
    case fromSharedActions.SET_METADATA:
      return {
        ...state,
        metadata: action.payload
      };
    case fromSharedActions.SET_IS_NEW_MODEL_ADD_JOBS: {
      return {
        ...state,
        isNewModelAddJobs: action.payload || false
      }
    }
    case fromSharedActions.SET_IS_NEW_MODEL_MODEL_SETTINGS: {
      return {
        ...state,
        isNewModelModelSettings: action.payload || false
      }
    }
    default:
      return state;
  }
}

export const getMetadata = (state: State) => state.metadata;
export const getIsNewModelAddJobs = (state:State) => state.isNewModelAddJobs;
export const getIsNewModelModelSettings = (state:State) => state.isNewModelModelSettings;
