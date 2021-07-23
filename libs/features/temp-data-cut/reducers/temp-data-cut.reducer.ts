import cloneDeep from 'lodash/cloneDeep';

import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api';
import { DataCutSummaryEntityTypes } from 'libs/constants';

import * as fromTempDataCutActions from '../actions/temp-data-cut.actions';
import { TempDataCutIdentity } from '../models';

export interface State {
  creating: boolean;
  editing: boolean;
  complete: boolean;
  tempDataCutFilterContextDictionary: {[key: string]: BaseExchangeDataSearchRequest}; // TODO: Should be any? [JP]
  tempDataCut?: TempDataCutIdentity;
}

const initialState: State = {
  creating: false,
  editing: false,
  complete: false,
  tempDataCutFilterContextDictionary: {},
  tempDataCut: null
};

// Reducer function
export function reducer(state = initialState, action: fromTempDataCutActions.TempDataCutActions): State {
  switch (action.type) {
    case fromTempDataCutActions.CREATE_TEMP_DATA_CUT: {

      return {
        ...state,
        creating: true,
        editing: false,
        complete: false,
        tempDataCut: {
          ExchangeJobId: action.payload.exchangeJobId,
          MatchType: DataCutSummaryEntityTypes.CustomPeerCutId
        }
      };
    }
    case fromTempDataCutActions.CREATE_TEMP_DATA_CUT_COMPLETE: {
      const payload: {tempDataCutId: string, exchangeDataSearchRequest: any} = action.payload;
      const filterContextDictionaryCopy = cloneDeep(state.tempDataCutFilterContextDictionary);
      filterContextDictionaryCopy[payload.tempDataCutId] = payload.exchangeDataSearchRequest;
      return {
        ...state,
        creating: false,
        editing: false,
        complete: true,
        tempDataCutFilterContextDictionary: filterContextDictionaryCopy,
        tempDataCut: null
      };
    }
    case fromTempDataCutActions.EDIT_TEMP_DATA_CUT: {
      const filterContextDictionaryCopy = cloneDeep(state.tempDataCutFilterContextDictionary);
      const isTempDataCut = action.payload.MatchType === DataCutSummaryEntityTypes.CustomPeerCutId && !!filterContextDictionaryCopy[action.payload.MatchId];
      return {
        ...state,
        creating: false,
        editing: true,
        complete: false,
        tempDataCut: {
          ...action.payload,
          FilterContext: isTempDataCut ? filterContextDictionaryCopy[action.payload.MatchId] : null
        }
      };
    }
    case fromTempDataCutActions.EDIT_TEMP_DATA_CUT_COMPLETE: {
      const filterContextDictionaryCopy = cloneDeep(state.tempDataCutFilterContextDictionary);
      const currentTempDataCut = state.tempDataCut;
      const editCancelled = !action.payload;
      if (!editCancelled) {
        const payload: {tempDataCutId: string, exchangeDataSearchRequest: any} = action.payload;
        filterContextDictionaryCopy[payload.tempDataCutId] = payload.exchangeDataSearchRequest;
      } else if (currentTempDataCut.MatchType !== DataCutSummaryEntityTypes.CustomPeerCutId) {
        // we don't want to remove the filter context for custom peer cuts if the edit is cancelled, they still exist and should be validated against [JP]
        delete filterContextDictionaryCopy[currentTempDataCut.MatchId];
      }

      return {
        ...state,
        creating: false,
        editing: false,
        complete: true,
        tempDataCutFilterContextDictionary: filterContextDictionaryCopy,
        tempDataCut: null
      };
    }
    case fromTempDataCutActions.RESET_TEMP_DATA_CUT_SERVICE: {
      return {
        ...initialState
      };
    }
    default: {
      return state;
    }
  }
}

// Selector functions
export const getUpserting = (state: State) => !state.complete && (!!state.creating || !!state.editing);
export const getCreating = (state: State) => state.creating;
export const getEditing = (state: State) => state.editing;
export const getComplete = (state: State) => state.complete;
export const getCurrent = (state: State) => state.tempDataCut;
export const getFilterContextDictionary = (state: State) => state.tempDataCutFilterContextDictionary;
