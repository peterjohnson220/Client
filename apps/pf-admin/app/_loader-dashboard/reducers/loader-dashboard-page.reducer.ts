import {isObject} from 'lodash';

import {AsyncStateObjHelper} from 'libs/core/helpers';
import {AsyncStateObj, generateDefaultAsyncStateObj} from 'libs/models/state';
import {CompositeDataLoadViewResponse} from 'libs/models/admin/loader-dashboard/response';

import * as fromLoaderDashboardPageActions from '../actions/loader-dashboard-page.actions';
import {GridSearchPayload} from '../models';

export interface State {
  GridSearchPayload: GridSearchPayload;
  CompositeLoadsObj: AsyncStateObj<CompositeDataLoadViewResponse[]>;
}

export const initialState: State = {
  GridSearchPayload: null,
  CompositeLoadsObj: generateDefaultAsyncStateObj<CompositeDataLoadViewResponse[]>([])
};

export function reducer(state = initialState, action: fromLoaderDashboardPageActions.Actions): State {
  switch (action.type) {
    case fromLoaderDashboardPageActions.INIT:
      if (!isObject(state.GridSearchPayload)) {
        return {
          ...state,
          GridSearchPayload: action.payload
        };
      }
      return state;
    case fromLoaderDashboardPageActions.GET_GRID_DATA: {
      return AsyncStateObjHelper.loading(state, 'CompositeLoadsObj');
    }
    case fromLoaderDashboardPageActions.GET_GRID_DATA_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'CompositeLoadsObj', action.payload);
    }
    case fromLoaderDashboardPageActions.GET_GRID_DATA_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'CompositeLoadsObj');
    }
    case fromLoaderDashboardPageActions.UPDATE_GRID_SEARCH_PAYLOAD: {
      const searchPayload = { ...state.GridSearchPayload };
      action.payload.forEach(obj => {
        searchPayload[obj.key] = obj.value;
      });
      return {
        ...state,
        GridSearchPayload: searchPayload
      };
    }
    default: {
      return state;
    }
  }
}

export const getCompositeLoadsObj = (state: State) => state.CompositeLoadsObj;
export const getCompositeLoadsResult = (state: State) => state.CompositeLoadsObj.obj;
export const getGridSearchPayload = (state: State) => state.GridSearchPayload;
