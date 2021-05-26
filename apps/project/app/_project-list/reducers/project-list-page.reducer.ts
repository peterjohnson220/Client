import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import * as fromProjectListPageActions from '../actions';

export interface State {
  SingleProjectShareId: number;
  TooltipContent: AsyncStateObj<any>;
}

export const initialState: State = {
  SingleProjectShareId: null,
  TooltipContent: generateDefaultAsyncStateObj<any>({})
};

export function reducer(state = initialState, action: fromProjectListPageActions.ProjectListPageActions): State {
  switch (action.type) {
    case fromProjectListPageActions.SAVE_SINGLE_PROJECT_SHARE_ID:
      return {
        ...state,
        SingleProjectShareId: action.payload
      };
    case fromProjectListPageActions.CLEAR_SINGLE_PROJECT_SHARE_ID:
    case fromProjectListPageActions.BULK_PROJECT_SHARE_ERROR:
      return {
        ...state,
        SingleProjectShareId: null
      };
    case fromProjectListPageActions.GET_TOOLTIP_CONTENT:
      return AsyncStateObjHelper.loading(state, 'TooltipContent');
    case fromProjectListPageActions.GET_TOOLTIP_CONTENT_SUCCESS:
      return AsyncStateObjHelper.loadingSuccess(state, 'TooltipContent', action.payload);
    case fromProjectListPageActions.GET_TOOLTIP_CONTENT_ERROR:
      return AsyncStateObjHelper.loadingError(state, 'TooltipContent');
    case fromProjectListPageActions.CLEAR_TOOLTIP:
      return {
        ...state,
        TooltipContent: initialState.TooltipContent
      };
    default: {
      return state;
    }
  }
}

export const getSingleProjectShareId = (state: State) => state.SingleProjectShareId;
export const getTooltipContent = (state: State) => state.TooltipContent.obj;
export const getTooltipLoading = (state: State) => state.TooltipContent.loading;
export const getTooltipError = (state: State) => state.TooltipContent.loadingError;
