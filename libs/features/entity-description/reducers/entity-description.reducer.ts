import * as fromEntityDescriptionActions from '../actions/';

export interface State {
  loadingEntityDescription: boolean;
  loadingEntityDescriptionError: boolean;
  entityDescription: string;
  entityType: string;
}

export const initialState: State = {
  loadingEntityDescription: false,
  loadingEntityDescriptionError: false,
  entityDescription: '',
  entityType: ''
};

export function reducer(state = initialState, action: fromEntityDescriptionActions.Actions): State {
  switch (action.type) {

    case fromEntityDescriptionActions.GET_ENTITY_DESCRIPTION: {
      return {
        ...state,
        loadingEntityDescription: true,
        loadingEntityDescriptionError: false,
        entityType: action.payload.entityType
      };
    }

    case fromEntityDescriptionActions.GET_ENTITY_DESCRIPTION_SUCCESS: {
      return {
        ...state,
        loadingEntityDescription: false,
        entityDescription: action.payload
      };
    }

    case fromEntityDescriptionActions.GET_ENTITY_DESCRIPTION_ERROR: {
      return {
        ...state,
        loadingEntityDescription: false,
        loadingEntityDescriptionError: true
      };
    }

    default:
      return state;
  }
}

export const getEntityDescription = (state: State) => state.entityDescription;
export const getEntityType = (state: State) => state.entityType;
export const getLoadingEntityDescription = (state: State) => state.loadingEntityDescription;
