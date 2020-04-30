import { cloneDeep } from 'lodash';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { MultiSelectItemGroup } from 'libs/ui/common';
import { MultiSelectDropdownHelper } from 'libs/ui/common/multi-select-dropdown/helpers';

import * as fromGridActionsBarActions from '../actions/grid-actions-bar.actions';

export interface State {
  sizes: AsyncStateObj<MultiSelectItemGroup[]>;
  selectedSizes: string[];
}

const initialState: State = {
  sizes: generateDefaultAsyncStateObj([]),
  selectedSizes: []
};

export function reducer(state = initialState, action: fromGridActionsBarActions.Actions): State {
  switch (action.type) {
    case fromGridActionsBarActions.GET_COMPANY_SCOPE_SIZES: {
      const sizesClone: AsyncStateObj<MultiSelectItemGroup[]> = cloneDeep(state.sizes);
      sizesClone.loading = true;
      sizesClone.loadingError = false;

      return {
        ...state,
        sizes: sizesClone
      };
    }
    case fromGridActionsBarActions.GET_COMPANY_SCOPE_SIZES_SUCCESS: {
      const sizesClone: AsyncStateObj<MultiSelectItemGroup[]> = cloneDeep(state.sizes);
      sizesClone.loading = false;
      sizesClone.obj = action.payload;

      return {
        ...state,
        sizes: sizesClone
      };
    }
    case fromGridActionsBarActions.GET_COMPANY_SCOPE_SIZES_ERROR: {
      const sizesClone: AsyncStateObj<MultiSelectItemGroup[]> = cloneDeep(state.sizes);
      sizesClone.loading = false;
      sizesClone.loadingError = true;

      return {
        ...state,
        sizes: sizesClone
      };
    }
    case fromGridActionsBarActions.UPDATE_SELECTED_SIZES: {
      const sizesClone: AsyncStateObj<MultiSelectItemGroup[]> = cloneDeep(state.sizes);
      sizesClone.obj = action.payload;
      return {
        ...state,
        selectedSizes: MultiSelectDropdownHelper.getSelectedValues(action.payload),
        sizes: sizesClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompanyScopeSizes = (state: State) => state.sizes;
export const getSelectedSizes = (state: State) => state.selectedSizes;
