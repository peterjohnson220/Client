import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { ProductAsset } from 'libs/models/product-assets';

import * as fromProductAssetListActions from '../actions/';

// Extended entity state
export interface State extends EntityState<ProductAsset> {
  loading: boolean;
  loadingError: boolean;
  whatsNewEnabled: boolean;
  filteredProductAssetsList: ProductAsset[];
}

// Create entity adapter
export const adapter: EntityAdapter<ProductAsset> = createEntityAdapter<ProductAsset>({
  selectId: (productAsset: ProductAsset) => productAsset.ProductAssetId
});


// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  whatsNewEnabled: false,
  filteredProductAssetsList: null
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
        loading: false,
        filteredProductAssetsList: action.payload,
        whatsNewEnabled: action.payload.filter(e => (Date.now() - (new Date(e.CreateDate.toString()).getTime())) <= (1000 * 3600 * 24 * 90)).length > 0
      };
    }
    case fromProductAssetListActions.LOADING_PRODUCT_ASSETS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromProductAssetListActions.FILTER_PRODUCT_ASSETS: {
      return {
        ...state,
        filteredProductAssetsList: Object.values(state.entities).filter(e => new RegExp(action.payload, 'gi').test(e.Title))
      };
    }
    case fromProductAssetListActions.SHOW_NEW_ASSETS: {
      return {
        ...state,
        filteredProductAssetsList: Object.values(state.entities).filter(e => (Date.now() - (new Date(e.CreateDate.toString()).getTime())) <= (1000 * 3600 * 24 * 90))
      };
    }
    case fromProductAssetListActions.LOAD_ALL_ASSETS: {
      return {
        ...state,
        filteredProductAssetsList: Object.values(state.entities)
      }
    }
    default: {
      return state;
    }
  }
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getWhatsNewEnabled = (state: State) => state.whatsNewEnabled;
export const getFilteredProductAssetsList = (state: State) => state.filteredProductAssetsList;

