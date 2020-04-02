import {EntityChoice} from '../models';

import {OrgDataEntityType} from 'libs/constants/hris-api';
import {AsyncStateObjHelper} from 'libs/core/helpers';
import {AsyncStateObj, generateDefaultAsyncStateObj} from 'libs/models/state';

import * as fromEntitySelectionActions from '../actions/entity-selection.actions';

export interface State {
  providerSupportedEntitiesObj: AsyncStateObj<EntityChoice[]>;
  updatedProviderSupportedEntitiesObj: AsyncStateObj<OrgDataEntityType[]>;
}

export const initialState: State = {
  providerSupportedEntitiesObj: generateDefaultAsyncStateObj<EntityChoice[]>([]),
  updatedProviderSupportedEntitiesObj: generateDefaultAsyncStateObj<OrgDataEntityType[]>([]),
};

export function reducer(state: State = initialState, action: fromEntitySelectionActions.Actions) {
  switch (action.type) {
    case fromEntitySelectionActions.INIT:
    case fromEntitySelectionActions.LOAD_ENTITY_SELECTION: {
      return AsyncStateObjHelper.loading(state, 'providerSupportedEntitiesObj');
    }
    case fromEntitySelectionActions.LOAD_ENTITY_SELECTION_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'providerSupportedEntitiesObj', action.payload);
    }
    case fromEntitySelectionActions.LOAD_ENTITY_SELECTION_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'providerSupportedEntitiesObj');
    }
    case fromEntitySelectionActions.UPDATE_ENTITY_SELECTIONS: {
      return AsyncStateObjHelper.saving(state, 'updatedProviderSupportedEntitiesObj', action.payload);
    }
    case fromEntitySelectionActions.UPDATE_ENTITY_SELECTIONS_SUCCESS: {
      return AsyncStateObjHelper.savingSuccess(state, 'updatedProviderSupportedEntitiesObj', []);
    }
    case fromEntitySelectionActions.UPDATE_ENTITY_SELECTIONS_ERROR: {
      return AsyncStateObjHelper.savingError(state, 'updatedProviderSupportedEntitiesObj');
    }
    case fromEntitySelectionActions.SET_ENTITY_SELECTION: {
      return AsyncStateObjHelper.savingSuccess(state, 'updatedProviderSupportedEntitiesObj', action.payload);
    }
    default:
      return state;
  }
}

export const getProviderSupportedEntitiesObj = (state: State) => state.providerSupportedEntitiesObj;
export const getUpdatedProviderSupportedEntitiesObj = (state: State) => state.updatedProviderSupportedEntitiesObj;
