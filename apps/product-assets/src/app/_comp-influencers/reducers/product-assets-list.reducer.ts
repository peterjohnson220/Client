import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ProductAsset } from '../models';

import * as fromProductAssetListActions from '../actions/';

// Extended entity state
export interface State extends EntityState<ProductAsset> {
  loading: boolean;
  loadingError: boolean;
}

// Create entity adapter
export const adapter: EntityAdapter<ProductAsset> = createEntityAdapter<ProductAsset>({
  selectId: (productAsset: ProductAsset) => productAsset.Id
});


// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false
});


// Reducer
export function reducer(
  state = initialState,
  action: fromProductAssetListActions.Actions
): State {
  switch (action.type) {
    case fromProductAssetListActions.LOADING_PRODUCT_ASSETS: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromProductAssetListActions.LOADING_PRODUCT_ASSETS_SUCCESS: {
      return {
        ...adapter.addAll(action.payload, state),
        loading: false
      };
    }
    case fromProductAssetListActions.LOADING_PRODUCT_ASSETS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;

