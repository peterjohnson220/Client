import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { ViewListGridItem } from '../../shared/models/view-list-grid-item';

import * as fromViewsListActions from '../actions/views-list.actions';

export interface State {
  viewsAsyncObj: AsyncStateObj<ViewListGridItem[]>;
}

export const initialState: State = {
  viewsAsyncObj: generateDefaultAsyncStateObj<ViewListGridItem[]>([])
};

export function reducer(state = initialState, action: fromViewsListActions.Actions): State {
  switch (action.type) {
    case fromViewsListActions.LOAD_JOB_DESCRIPTION_SETTINGS_VIEWS: {
      return AsyncStateObjHelper.loading(state, 'viewsAsyncObj');
    }
    case fromViewsListActions.LOAD_JOB_DESCRIPTION_SETTINGS_VIEWS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'viewsAsyncObj', action.payload);
    }
    case fromViewsListActions.LOAD_JOB_DESCRIPTION_SETTINGS_VIEWS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'viewsAsyncObj');
    }
    default: {
      return state;
    }
  }
}

export const getViewsAsyncObj = (state: State) => state.viewsAsyncObj;
