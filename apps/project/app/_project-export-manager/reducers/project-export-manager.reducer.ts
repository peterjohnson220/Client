import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { ProjectTemplate } from 'libs/models/projects/project-templates';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import * as fromProjectExportManagerActions from '../actions';

export interface State {
  projectTemplates: AsyncStateObj<ProjectTemplate[]>;
}

export const initialState: State = {
  projectTemplates: generateDefaultAsyncStateObj<ProjectTemplate[]>([])
};

export function reducer(state = initialState, action: fromProjectExportManagerActions.Actions): State {
  switch (action.type) {
    case fromProjectExportManagerActions.GET_PROJECT_TEMPLATES: {
      return AsyncStateObjHelper.loading(state, 'projectTemplates');
    }
    case fromProjectExportManagerActions.GET_PROJECT_TEMPLATES_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'projectTemplates', action.payload);
    }
    case fromProjectExportManagerActions.GET_PROJECT_TEMPLATES_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'projectTemplates', action.payload);
    }
    default:
      return state;
  }
}

export const getProjectTemplatesAsync = (state: State) => state.projectTemplates;
