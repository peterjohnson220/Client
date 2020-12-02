import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { ProjectTemplate } from 'libs/models';

import * as fromProjectTemplateActions from '../actions/project-template.actions';

// Define our feature state
export interface State {
  projectTemplates: AsyncStateObj<ProjectTemplate[]>;
  deletingTemplate: boolean;
}

// Define our initial state
const initialState: State = {
  projectTemplates: generateDefaultAsyncStateObj<ProjectTemplate[]>([]),
  deletingTemplate: false
};

// Reducer function
export function reducer(state = initialState, action: fromProjectTemplateActions.Actions): State {
  switch (action.type) {
    case fromProjectTemplateActions.GET_PROJECT_TEMPLATES: {
      const projectTemplatesClone = cloneDeep(state.projectTemplates);
      projectTemplatesClone.loading = true;
      projectTemplatesClone.loadingError = false;
      return {
        ...state,
        projectTemplates: projectTemplatesClone
      };
    }
    case fromProjectTemplateActions.GET_PROJECT_TEMPLATES_SUCCESS: {
      const projectTemplatesClone = cloneDeep(state.projectTemplates);
      projectTemplatesClone.loading = false;
      projectTemplatesClone.obj = action.payload;
      return {
        ...state,
        projectTemplates: projectTemplatesClone
      };
    }
    case fromProjectTemplateActions.GET_PROJECT_TEMPLATES_ERROR: {
      const projectTemplatesClone = cloneDeep(state.projectTemplates);
      projectTemplatesClone.loading = false;
      projectTemplatesClone.loadingError = true;

      return {
        ...state,
        projectTemplates: projectTemplatesClone
      };
    }
    case fromProjectTemplateActions.DELETE_PROJECT_TEMPLATE: {
      return {
        ...state,
        deletingTemplate: true
      };
    }
    case fromProjectTemplateActions.DELETE_PROJECT_TEMPLATE_SUCCESS: {
      const projectTemplatesClone = cloneDeep(state.projectTemplates);
      projectTemplatesClone.obj = projectTemplatesClone.obj.filter(x => x.ProjectTemplateId !== action.payload);
      return {
        ...state,
        projectTemplates: projectTemplatesClone
      };
    }
    default: {
      return state;
    }
  }
}

export const getProjectTemplatesAsync = (state: State) => state.projectTemplates;

