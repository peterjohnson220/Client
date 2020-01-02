import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { arrayMoveMutate } from 'libs/core/functions';

import * as fromSharedWorkflowActions from '../actions/shared-workflow.actions';
import { WorkflowStep, WorkflowTemplate, WorkflowUser} from '../models';
import { JobDescriptionManagementService } from '../services';

export interface State {
  templateListAsync: AsyncStateObj<WorkflowTemplate[]>;
  saving: boolean;
  deleting: boolean;
  errorMessage: string;
  dirty: boolean;
  prepopulating: boolean;
  prepopulated: boolean;
  steps: WorkflowUser[];
  workflowSteps: WorkflowStep[];
  hasUsersWithoutPermission: boolean;
  newUser: WorkflowUser;
  rerouting: boolean;
}

const initialState: State = {
  templateListAsync: generateDefaultAsyncStateObj<WorkflowTemplate[]>([]),
  saving: false,
  deleting: false,
  errorMessage: '',
  dirty: false,
  prepopulating: false,
  prepopulated: false,
  steps: [],
  workflowSteps: [],
  hasUsersWithoutPermission: false,
  newUser: null,
  rerouting: false
};

export function reducer(state = initialState, action: fromSharedWorkflowActions.Actions): State {
  switch (action.type) {
    case fromSharedWorkflowActions.LOAD: {
      const templateListAsyncClone = cloneDeep(state.templateListAsync);
      templateListAsyncClone.loading = true;
      return {
        ...state,
        templateListAsync: templateListAsyncClone
      };
    }
    case fromSharedWorkflowActions.LOAD_SUCCESS: {
      const templateListAsyncClone = cloneDeep(state.templateListAsync);
      templateListAsyncClone.loading = false;
      templateListAsyncClone.obj = action.payload.templateList;
      return {
        ...state,
        templateListAsync: templateListAsyncClone
      };
    }
    case fromSharedWorkflowActions.LOAD_ERROR: {
      const templateListAsyncClone = cloneDeep(state.templateListAsync);
      let errorMessageClone = cloneDeep(state.errorMessage);
      templateListAsyncClone.loading = false;
      templateListAsyncClone.loadingError = true;
      errorMessageClone = buildErrorMessage('There was an error loading the routing workflow list.');
      return {
        ...state,
        templateListAsync: templateListAsyncClone,
        errorMessage: errorMessageClone
      };
    }
    case fromSharedWorkflowActions.SAVE_TEMPLATE: {
      return {
        ...state,
        saving: true
      };
    }
    case fromSharedWorkflowActions.SAVE_TEMPLATE_SUCCESS: {
      const templateListAsyncClone = cloneDeep(state.templateListAsync);
      const workflowTemplate = action.payload.workflowTemplate;
      const templateToUpdate = templateListAsyncClone.obj.find(tl => tl.Id === workflowTemplate.Id);
      if (!!templateToUpdate) {
        templateToUpdate.Id = workflowTemplate.Id;
        templateToUpdate.Name = workflowTemplate.Name;
        templateToUpdate.Steps = workflowTemplate.Steps;
      } else {
        const templateList = templateListAsyncClone.obj.slice(0);
        templateList.push(workflowTemplate);
        templateListAsyncClone.obj = templateList;
      }
      return {
        ...state,
        templateListAsync: templateListAsyncClone,
        saving: false
      };
    }
    case fromSharedWorkflowActions.SAVE_TEMPLATE_ERROR: {
      const templateListAsyncClone = cloneDeep(state.templateListAsync);
      let errorMessageClone = cloneDeep(state.errorMessage);
      templateListAsyncClone.loadingError = true;
      errorMessageClone = buildErrorMessage('There was an error saving the workflow');
      return {
        ...state,
        saving: false,
        errorMessage: errorMessageClone
      };
    }
    case fromSharedWorkflowActions.DELETE_TEMPLATE: {
      return {
        ...state,
        deleting: true
      };
    }
    case fromSharedWorkflowActions.DELETE_TEMPLATE_SUCCESS: {
      const templateListAsyncClone = cloneDeep(state.templateListAsync);
      templateListAsyncClone.obj = templateListAsyncClone.obj.filter(tl => tl.Id !== action.payload.workflowTemplateId);
      return {
        ...state,
        templateListAsync: templateListAsyncClone,
        deleting: false
      };
    }
    case fromSharedWorkflowActions.DELETE_TEMPLATE_ERROR: {
      const templateListAsyncClone = cloneDeep(state.templateListAsync);
      let errorMessageClone = cloneDeep(state.errorMessage);
      templateListAsyncClone.loadingError = true;
      errorMessageClone = buildErrorMessage('There was an error deleting the workflow');
      return {
        ...state,
        templateListAsync: templateListAsyncClone,
        errorMessage: errorMessageClone
      };
    }
    case fromSharedWorkflowActions.SET_NEW_USER: {
      const newUserClone = cloneDeep(action.payload.user);
      if (newUserClone) {
        newUserClone.Permissions = JobDescriptionManagementService.getDefaultPermissions();
      }
      return {
        ...state,
        newUser: newUserClone
      };
    }
    case fromSharedWorkflowActions.RESET_NEW_USER: {
      return {
        ...state,
        newUser: null
      };
    }
    case fromSharedWorkflowActions.SET_NEW_USER_PERMISSIONS: {
      const newUserClone = cloneDeep(state.newUser);
      if (newUserClone) {
        const permission = action.payload.permission;
        const selected = action.payload.selected;

        newUserClone.Permissions.map(p => {
          if (p.permission === permission) {
            p.selected = selected;
          }
          return p;
        });
      }
      return {
        ...state,
        newUser: newUserClone
      };
    }
    case fromSharedWorkflowActions.ROUTE_NEW_USER: {
      const newUserClone = cloneDeep(state.newUser);
      newUserClone.Permissions = newUserClone.Permissions.filter(p => p.selected).map(p => p.permission);
      return {
        ...state,
        rerouting: true,
        newUser: newUserClone
      };
    }
    case fromSharedWorkflowActions.ROUTING_TO_NEW_USER_SUCCESS: {
      return {
        ...state,
        rerouting: false
      };
    }
    default:
      return state;
  }
}

// private functions
function buildErrorMessage(message: string) {
  return `${message} Please contact your services associate for assistance.`;
}

function hasUsersWithNoPermission(steps) {
  for (let i = 0; i < steps.length; i++) {
    for (let j = 0; j < steps[i].WorkflowStepUsers.length; j++) {
      if (steps[i].WorkflowStepUsers[j].Permissions && steps[i].WorkflowStepUsers[j].Permissions.length === 0) {
        return true;
      }
    }
  }
  return false;
}

export const getWorkflowTemplateList = (state: State) => state.templateListAsync;
export const getWorkflowTemplateListNames = (state: State) => state.templateListAsync.obj.map(tl => tl.Name);
export const getWorkflowTemplateListLoading = (state: State) => state.templateListAsync.loading;
export const getWorkflowTemplateListSaving = (state: State) => state.saving;
export const getWorkflowTemplateListDeleting = (state: State) => state.deleting;
export const getWorkflowTemplateListError = (state: State) => state.templateListAsync.loadingError;
export const getWorkflowTemplateListErrorMessage = (state: State) => state.errorMessage;
export const getWorkflowConfig = (state: State) => state.steps;
export const getWorkflowSteps = (state: State) => state.workflowSteps;
export const getWorkflowConfigDirty = (state: State) => state.dirty;
export const getWorkflowHasUsersWithoutPermission = (state: State) => state.hasUsersWithoutPermission;
export const getNewUser = (state: State) => state.newUser;
export const getRerouting = (state: State) => state.rerouting;


