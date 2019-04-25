import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import { TagCategory } from 'libs/models/peer/tag-category.model';
import { GridTypeEnum } from 'libs/models/common';
import { createGridReducer } from 'libs/core/reducers/grid.reducer';

import * as fromTagCategoriesActions from '../actions/tag-categories.actions';

// Extended Entity State
export interface State extends EntityState<TagCategory> {
  loading: boolean;
  loadingError: boolean;
  createTagCategoryModalOpen: boolean;
  creatingTagCategory: boolean;
  creatingTagCategoryError: boolean;
  total: number;
}

// Create entity adapter
export const adapter: EntityAdapter<TagCategory> = createEntityAdapter<TagCategory>({
  selectId: (tagCategoryInfo: TagCategory) => tagCategoryInfo.TagCategoryId
});

// Initial State
export const initialState: State = adapter.getInitialState({
  loading: false,
  loadingError: false,
  createTagCategoryModalOpen: false,
  creatingTagCategory: false,
  creatingTagCategoryError: false,
  total: 0
});

// Reducer
export function reducer(state, action) {
  return createGridReducer(
    GridTypeEnum.TagCategories,
    (featureState = initialState, featureAction: fromTagCategoriesActions.Actions): State => {
      switch (featureAction.type) {
        case fromTagCategoriesActions.LOAD_TAG_CATEGORIES: {
          return {
            ...adapter.removeAll(featureState),
            loading: true,
            loadingError: false
          };
        }
        case fromTagCategoriesActions.LOAD_TAG_CATEGORIES_SUCCESS: {
          const filters: TagCategory[] = featureAction.payload.data;
          return {
            ...adapter.addAll(filters, featureState),
            loading: false,
            loadingError: false,
            total: action.payload.total
          };
        }
        case fromTagCategoriesActions.LOAD_TAG_CATEGORIES_ERROR: {
          return {
            ...featureState,
            loading: false,
            loadingError: true
          };
        }
        case fromTagCategoriesActions.OPEN_CREATE_TAG_CATEGORY_MODAL: {
          return {
            ...featureState,
            createTagCategoryModalOpen: true
          };
        }
        case fromTagCategoriesActions.CLOSE_CREATE_TAG_CATEGORY_MODAL: {
          return {
            ...featureState,
            createTagCategoryModalOpen: false
          };
        }
        case fromTagCategoriesActions.CREATE_TAG_CATEGORY: {
          return {
            ...featureState,
            creatingTagCategory: true,
            creatingTagCategoryError: false
          };
        }
        case fromTagCategoriesActions.CREATE_TAG_CATEGORY_SUCCESS: {
          return {
            ...featureState,
            creatingTagCategory: false,
            creatingTagCategoryError: false,
            createTagCategoryModalOpen: false
          };
        }
        case fromTagCategoriesActions.CREATE_TAG_CATEGORY_ERROR: {
          return {
            ...featureState,
            creatingTagCategory: false,
            creatingTagCategoryError: true
          };
        }
        default: {
          return featureState;
        }
      }
    })(state, action);
}

// Selector Functions
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getTotal = (state: State) => state.total;
export const getCreateTagCategoryModalOpen = (state: State) => state.createTagCategoryModalOpen;
export const getCreatingTagCategory = (state: State) => state.creatingTagCategory;
export const getCreatingTagCategoryError = (state: State) => state.creatingTagCategoryError;
