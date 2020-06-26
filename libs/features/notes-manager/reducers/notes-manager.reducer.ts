import * as fromNotesManagerActions from '../actions';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core';
import { PricingNote } from 'libs/models/payfactors-api';

export interface State {
  notes: AsyncStateObj<PricingNote[]>;
}

export const initialState: State = {
  notes: generateDefaultAsyncStateObj<PricingNote[]>([]),
};

export function reducer(state = initialState, action: fromNotesManagerActions.Actions): State {
  switch (action.type) {
    case fromNotesManagerActions.RESET_STATE:
      return initialState;
    case fromNotesManagerActions.GET_NOTES:
      return AsyncStateObjHelper.loading(state, 'notes');
    case fromNotesManagerActions.GET_NOTES_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'notes', action.payload);
    case fromNotesManagerActions.GET_NOTES_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'notes');
    default:
      return state;
  }
}

export const getState = (state: State) => state;
export const getLoading = (state: State) => state.notes.loading;
export const getNotes = (state: State) => state.notes;
