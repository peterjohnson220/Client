import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import * as fromViewsListActions from '../actions/views-list.actions';
import { JobDescriptionViewListGridItem } from 'libs/models';

export interface State {
  viewsAsyncObj: AsyncStateObj<JobDescriptionViewListGridItem[]>;
}

export const initialState: State = {
  viewsAsyncObj: generateDefaultAsyncStateObj<JobDescriptionViewListGridItem[]>([])
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
