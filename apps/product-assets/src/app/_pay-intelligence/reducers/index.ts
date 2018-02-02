import { createSelector, createFeatureSelector } from '@ngrx/store';

// Import root app reducer
import * as fromRoot from 'libs/state/state';

// Import feature reducers
import * as fromProductAssetListReducer from './product-assets-list.reducer';


// Feature area state
export interface ProductAssetsState {
  productAssetList: fromProductAssetListReducer.State;
}

// Extend root state with feature area state
export interface State extends fromRoot.State {
  productAssets: ProductAssetsState;
}

// Feature area reducers
export const reducers = {
  productAssetList: fromProductAssetListReducer.reducer,
};

// Select Feature Area
export const selectProductAssetsState = createFeatureSelector<ProductAssetsState>('productAssets');

// Feature Selectors
export const selectProductAssetListState = createSelector(selectProductAssetsState, (state: ProductAssetsState) => state.productAssetList);


// Product Asset List Selectors
export const {
  selectAll: getProductAssetListItems,
} = fromProductAssetListReducer.adapter.getSelectors(selectProductAssetListState);

export const getProductAssetListLoading = createSelector(
  selectProductAssetListState, fromProductAssetListReducer.getLoading
);

export const getProductAssetListLoadingError = createSelector(
  selectProductAssetListState, fromProductAssetListReducer.getLoadingError
);

export const getProductAssetListWhatsNewEnabled = createSelector(
  selectProductAssetListState, fromProductAssetListReducer.getWhatsNewEnabled
);

export const getFilteredProductAssetList = createSelector(
  selectProductAssetListState, fromProductAssetListReducer.getFilteredProductAssetsList
);
