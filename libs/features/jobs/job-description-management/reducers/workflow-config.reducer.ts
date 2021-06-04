import cloneDeep from 'lodash/cloneDeep';

import { Permissions } from 'libs/constants/permissions';

import * as fromWorkflowConfigActions from '../actions';
import { WorkflowStep, WorkflowUser } from '../models';
import { WorkflowConfigHelper } from '../helpers';

export interface State {
  workflowSteps: WorkflowStep[];
  dirty: boolean;
  prepopulated: boolean;
  prepopulating: boolean;
  hasUsersWithoutPermission: boolean;
  selectedUserOrEmail: any;
  stepId: number;
}

export const initialState: State = {
  workflowSteps: [],
  dirty: false,
  prepopulated: false,
  prepopulating: false,
  hasUsersWithoutPermission: false,
  selectedUserOrEmail: null,
  stepId: 0
};

export function reducer(state = initialState, action: fromWorkflowConfigActions.WorkflowConfigActions): State {
  switch (action.type) {
    case fromWorkflowConfigActions.POPULATE_WORKFLOW: {
      const workflowSteps: WorkflowStep[] = cloneDeep(action.payload.workflowSteps);
      let stepId = state.stepId;

      workflowSteps.forEach((step: WorkflowStep) => {
        step.WorkflowStepUsers.forEach((user) => {
          const savedPermissions = user.Permissions;
          user.Permissions = WorkflowConfigHelper.getDefaultPermissions().map(permissionObj => {
            if (permissionObj.permission === Permissions.CAN_EDIT_JOB_DESCRIPTION) {
              permissionObj.selected = savedPermissions.includes(Permissions.CAN_EDIT_JOB_DESCRIPTION);
              return permissionObj;
            } else {
              return permissionObj;
            }
          });
          user.StepId = stepId;
          stepId++;
        });
      });

      return {
        ...state,
        workflowSteps: workflowSteps,
        prepopulating: action.payload.prepopulating,
        prepopulated: action.payload.prepopulating,
        dirty: false,
        stepId: stepId
      };
    }
    case fromWorkflowConfigActions.CREATE_WORKFLOW_STEP: {
      const workflowStepsClone: WorkflowStep[] = cloneDeep(state.workflowSteps);
      const workflowStepUser: WorkflowUser = cloneDeep(action.payload);
      const stepId = cloneDeep(state.stepId);
      workflowStepUser.StepId = stepId;
      const workflowStep: WorkflowStep = {
        WorkflowStepUsers: [workflowStepUser],
        Permissions: []
      };
      workflowStepsClone.push(workflowStep);
      return {
        ...state,
        workflowSteps: workflowStepsClone,
        dirty: true,
        hasUsersWithoutPermission: WorkflowConfigHelper.hasUsersWithNoPermission(workflowStepsClone),
        stepId: stepId + 1
      };
    }
    case fromWorkflowConfigActions.UPDATE_WORKFLOW_STEP_PERMISSION: {
      const workflowStepsClone: WorkflowStep[] = cloneDeep(state.workflowSteps);

      workflowStepsClone?.forEach( wfStep => {
        const wfUser = wfStep.WorkflowStepUsers?.find(u => u.UserId === action.payload.workflowUser.UserId
          && u.EmailAddress === action.payload.workflowUser.EmailAddress
          && u.StepId === action.payload.workflowUser.StepId);
        if (wfUser) {
          let canEditJobDescription = wfUser.Permissions.find((p) =>
            p.permission === Permissions.CAN_EDIT_JOB_DESCRIPTION).selected;

          canEditJobDescription = !canEditJobDescription;

          wfUser.Permissions.find((p) =>
            p.permission === Permissions.CAN_EDIT_JOB_DESCRIPTION).selected = canEditJobDescription;
        }
      });
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
      const workflowUser = cloneDeep(action.payload.workflowUser);
      const workflowStep = workflowStepsClone.find((s, index) => index === action.payload.stepIndex);
      let dirtyState = state.dirty;
      let stepId = state.stepId;
      if (!!workflowStep) {
        workflowUser.StepId = stepId;
        workflowStep.WorkflowStepUsers.push(workflowUser);
        dirtyState = true;
        stepId++;
      }
      return {
        ...state,
        workflowSteps: workflowStepsClone,
        dirty: dirtyState,
        hasUsersWithoutPermission: WorkflowConfigHelper.hasUsersWithNoPermission(workflowStepsClone),
        stepId: stepId
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
        prepopulating: false,
        selectedUserOrEmail: null
      };
    }
    case fromWorkflowConfigActions.ADD_SELECTED_USER_OR_EMAIL: {
      return {
        ...state,
        selectedUserOrEmail: action.payload
      };
    }
    case fromWorkflowConfigActions.DELETE_USER_OR_EMAIL: {
      const workflowSteps: WorkflowStep[] = cloneDeep(state.workflowSteps);

      for (let i = 0; i < workflowSteps.length; i++) {
        const userIndex = workflowSteps[i].WorkflowStepUsers.findIndex(u => u.UserId === action.payload.UserId);
        if (userIndex > -1) {
          workflowSteps[i].WorkflowStepUsers.splice(userIndex, 1);

          if (workflowSteps[i].WorkflowStepUsers.length === 0) {
            workflowSteps.splice(i, 1);
          }
          break;
        }
      }

      return {
        ...state,
        workflowSteps: workflowSteps
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
export const getWorkflowUserOrEmail = (state: State) => state.selectedUserOrEmail;
