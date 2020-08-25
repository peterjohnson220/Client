import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';
import { WorkflowTemplate } from 'libs/features/job-description-management/models';

import * as fromWorkflowListActions from '../actions';

export interface State {
    templateList: AsyncStateObj<WorkflowTemplate[]>;
}

export const initialState: State = {
    templateList: generateDefaultAsyncStateObj<WorkflowTemplate[]>([])
};

export function reducer(state = initialState, action: fromWorkflowListActions.ListActions): State {
  switch (action.type) {
    case fromWorkflowListActions.LOAD_WORKFLOW_TEMPLATE_LIST: {
      return AsyncStateObjHelper.loading(state, 'templateList');
    }
    case fromWorkflowListActions.LOAD_WORKFLOW_TEMPLATE_LIST_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'templateList', action.payload);
    }
    case fromWorkflowListActions.LOAD_WORKFLOW_TEMPLATE_LIST_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'templateList');
    }
    default: {
      return state;
    }
  }
}

export const getWorkflowTemplateList = (state: State) => state.templateList;
export const getWorkflowTemplateNames = (state: State) => state.templateList.obj.map(t => t.Name);
