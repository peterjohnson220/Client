import * as cloneDeep from 'lodash.clonedeep';

import * as fromWorkflowConfigActions from '../actions';
import { WorkflowStep } from '../models';
import { WorkflowConfigHelper } from '../helpers';

export interface State {
  workflowSteps: WorkflowStep[];
  dirty: boolean;
  prepopulated: boolean;
  prepopulating: boolean;
  hasUsersWithoutPermission: boolean;
}

export const initialState: State = {
  workflowSteps: [],
  dirty: false,
  prepopulated: false,
  prepopulating: false,
  hasUsersWithoutPermission: false
};

export function reducer(state = initialState, action: fromWorkflowConfigActions.WorkflowConfigActions): State {
  switch (action.type) {
    case fromWorkflowConfigActions.POPULATE_WORKFLOW: {
      const workflowSteps: WorkflowStep[] = cloneDeep(action.payload.workflowSteps);
      workflowSteps.map((step) => {
        const selectedPermissions = step.Permissions;
        const newPermissions = WorkflowConfigHelper.getDefaultPermissions();
        step.Permissions = newPermissions.map(p => {
          p.selected = !!selectedPermissions.find(sp => p.permission === sp);
          return p;
        });
        return step;
      });

      return {
        ...state,
        workflowSteps: workflowSteps,
        prepopulating: action.payload.prepopulating,
        prepopulated: action.payload.prepopulating,
        dirty: false
      };
    }
    case fromWorkflowConfigActions.CREATE_WORKFLOW_STEP: {
      const workflowStepsClone: WorkflowStep[] = cloneDeep(state.workflowSteps);
      const workflowStep: WorkflowStep = {
        WorkflowStepUsers: [action.payload],
        Permissions: WorkflowConfigHelper.getDefaultPermissions()
      };
      workflowStepsClone.push(workflowStep);
      return {
        ...state,
        workflowSteps: workflowStepsClone,
        dirty: true,
        hasUsersWithoutPermission: WorkflowConfigHelper.hasUsersWithNoPermission(workflowStepsClone)
      };
    }
    case fromWorkflowConfigActions.UPDATE_WORKFLOW_STEP_PERMISSION: {
      const workflowStepsClone: WorkflowStep[] = cloneDeep(state.workflowSteps);
      const workflowStep = workflowStepsClone.find((s, index) => index === action.payload.stepIndex);
      if (!!workflowStep) {
        const permission = workflowStep.Permissions.find(p => p.permission === action.payload.permission);
        if (!!permission) {
          permission.selected = action.payload.selected;
        }
      }
      return {
        ...state,
        workflowSteps: workflowStepsClone,
        dirty: true
      };
    }
    case fromWorkflowConfigActions.DELETE_WORKFLOW_STEP: {
      const workflowStepsClone = state.workflowSteps.filter((s, index) => index !== action.payload.stepIndex);
      const dirtyState = workflowStepsClone.length > 0 || !state.prepopulated;

      return {
        ...state,
        workflowSteps: workflowStepsClone,
        dirty: dirtyState,
        hasUsersWithoutPermission: WorkflowConfigHelper.hasUsersWithNoPermission(workflowStepsClone)
      };
    }
    case fromWorkflowConfigActions.ADD_USER_TO_WORKFLOW_STEP: {
      const workflowStepsClone: WorkflowStep[] = cloneDeep(state.workflowSteps);
      const workflowStep = workflowStepsClone.find((s, index) => index === action.payload.stepIndex);
      let dirtyState = state.dirty;
      if (!!workflowStep) {
        workflowStep.WorkflowStepUsers.push(action.payload.workflowUser);
        dirtyState = true;
      }
      return {
        ...state,
        workflowSteps: workflowStepsClone,
        dirty: dirtyState,
        hasUsersWithoutPermission: WorkflowConfigHelper.hasUsersWithNoPermission(workflowStepsClone)
      };
    }
    case fromWorkflowConfigActions.REORDER_WORKFLOW_STEPS: {
      return {
        ...state,
        workflowSteps: action.payload,
        dirty: true
      };
    }
    case fromWorkflowConfigActions.RESET_WORKFLOW: {
      const workflowStepsClone = state.prepopulating ? state.workflowSteps : [];
      return {
        ...state,
        dirty: false,
        workflowSteps: workflowStepsClone,
        prepopulating: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getHasUsersWithoutPermission = (state: State) => state.hasUsersWithoutPermission;
export const getWorkflowStepsFromWorkflowConfig = (state: State) => state.workflowSteps;
export const getWorkflowConfigDirty = (state: State) => state.dirty;
