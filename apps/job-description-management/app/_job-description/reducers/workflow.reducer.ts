import cloneDeep from 'lodash/cloneDeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { Permissions } from 'libs/constants';

import * as fromWorkflowActions from '../actions/workflow.actions';
import { Workflow, WorkflowLogEntry, WorkflowStepSummaryItem } from '../models';

export interface State {
  workflowLogEntriesAsync: AsyncStateObj<WorkflowLogEntry[]>;
  workflowStepSummaryAsync: AsyncStateObj<WorkflowStepSummaryItem[]>;
  approving: boolean;
  rejecting: boolean;
  workflowLinkLoading: boolean;
  workflowLinkLoaded: boolean;
  workflowLink: string;
  workflow: Workflow;
  workFlowSaveObj: any;
  saving: boolean;
  message: string;
  completedStep: boolean;
  completedStepError: boolean;
}

export const initialState: State = {
  workflowLogEntriesAsync: generateDefaultAsyncStateObj<WorkflowLogEntry[]>([]),
  workflowStepSummaryAsync: generateDefaultAsyncStateObj<WorkflowStepSummaryItem[]>([]),
  approving: false,
  rejecting: false,
  workflowLinkLoading: false,
  workflowLinkLoaded: false,
  workflowLink: '',
  workflow: null,
  workFlowSaveObj: null,
  saving: false,
  message: '',
  completedStep: false,
  completedStepError: false
};

export function reducer(state = initialState, action: fromWorkflowActions.Actions): State {
  switch (action.type) {
    case fromWorkflowActions.LOAD_WORKFLOW_LOG_ENTRIES: {
      const workflowLogEntriesAsyncClone = cloneDeep(state.workflowLogEntriesAsync);
      workflowLogEntriesAsyncClone.loading = true;

      return {
        ...state,
        workflowLogEntriesAsync: workflowLogEntriesAsyncClone
      };
    }
    case fromWorkflowActions.LOAD_WORKFLOW_LOG_ENTRIES_SUCCESS: {
      const workflowLogEntriesAsyncClone = cloneDeep(state.workflowLogEntriesAsync);
      workflowLogEntriesAsyncClone.loading = false;
      workflowLogEntriesAsyncClone.obj = action.payload;

      return {
        ...state,
        workflowLogEntriesAsync: workflowLogEntriesAsyncClone
      };
    }
    case fromWorkflowActions.LOAD_WORKFLOW_STEP_SUMMARY: {
      const workflowStepSummaryAsyncClone = cloneDeep(state.workflowStepSummaryAsync);
      workflowStepSummaryAsyncClone.loading = true;

      return {
        ...state,
        workflowStepSummaryAsync: workflowStepSummaryAsyncClone
      };
    }
    case fromWorkflowActions.LOAD_WORKFLOW_STEP_SUMMARY_SUCCESS: {
      const workflowStepSummaryAsyncClone = cloneDeep(state.workflowStepSummaryAsync);
      workflowStepSummaryAsyncClone.loading = false;
      workflowStepSummaryAsyncClone.obj = action.payload;

      return {
        ...state,
        workflowStepSummaryAsync: workflowStepSummaryAsyncClone
      };
    }
    case fromWorkflowActions.APPROVE_WORKFLOW_STEP: {
      return {
        ...state,
        approving: true
      };
    }
    case fromWorkflowActions.REJECT_WORKFLOW_STEP: {
      return {
        ...state,
        rejecting: true
      };
    }
    case fromWorkflowActions.COMPLETE_WORKFLOW_STEP_SUCCESS: {

      return {
        ...state,
        approving: false,
        rejecting: false,
        completedStepError: false
      };
    }
    case fromWorkflowActions.COMPLETE_WORKFLOW_STEP_ERROR: {

      return {
        ...state,
        approving: false,
        rejecting: false,
        completedStepError: true
      };
    }
    case fromWorkflowActions.GET_WORKFLOW_LINK: {
      return {
        ...state,
        workflowLinkLoading: true
      };
    }
    case fromWorkflowActions.GET_WORKFLOW_LINK_SUCCESS: {
        return {
          ...state,
          workflowLinkLoading: false,
          workflowLinkLoaded: true,
          workflowLink: action.payload
        };
    }
    case fromWorkflowActions.SAVING_WORKFLOW: {
      return {
        ...state,
        saving: true
      };
    }
    case fromWorkflowActions.SAVING_WORKFLOW_SUCCESS: {
      return {
        ...state,
        saving: false
      };
    }
    case fromWorkflowActions.SAVING_WORKFLOW_ERROR: {
      const workflowSaveObjClone = cloneDeep(state.workFlowSaveObj);
      workflowSaveObjClone.loadingError = true;
      return {
        ...state,
        workFlowSaveObj: workflowSaveObjClone
      };
    }
    case fromWorkflowActions.CREATE_WORKFLOW: {
      const workflowClone = cloneDeep(state.workflow);
      workflowClone.EntityType = 'JobDescription';
      workflowClone.EntityId = action.payload.entityId;
      workflowClone.EntityTitle = action.payload.entityTitle;
      workflowClone.WorkflowUrl = action.payload.workflowUrl;
      workflowClone.Revision = action.payload.revision;
      workflowClone.WorkflowSteps = [];
      workflowClone.InitiationComment = '';
      workflowClone.AllAvailablePermissions = [ Permissions.JOB_DESCRIPTIONS, Permissions.CAN_EDIT_JOB_DESCRIPTION ];
      return {
        ...state,
        workflow: workflowClone
      };
    }
    case fromWorkflowActions.UPDATE_WORKFLOW_INITIATION_COMMENT: {
      const workflowClone = cloneDeep(state.workflow);
      workflowClone.InitiationComment = action.payload.comment;
      return {
        ...state,
        workflow: workflowClone
      };
    }
    case fromWorkflowActions.UPDATE_WORKFLOW_STEPS: {
      const workflowClone = cloneDeep(state.workflow);
      workflowClone.WorkflowSteps = action.payload.steps;
      return {
        ...state,
        workflow: workflowClone
      };
    }
    case fromWorkflowActions.BUILD_WORKFLOW_SAVE_OBJ: {
      let workflowStateObjClone = cloneDeep(state.workFlowSaveObj);
      workflowStateObjClone = JSON.parse(JSON.stringify(state.workflow));
      workflowStateObjClone.WorkflowSteps.map(step => {
        delete step['UserPicture'];
        step.Permissions = step.Permissions.filter(p => p.selected).map(p => p.permission);
        return step;
      });
      return {
        ...state,
        workFlowSaveObj: workflowStateObjClone
      };
    }
    case fromWorkflowActions.SET_MESSAGE: {
      return {
        ...state,
        message: action.payload.message,
        completedStep: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getWorkflowLogEntries = (state: State) => state.workflowLogEntriesAsync;
export const getWorkflowLogLoading = (state: State) => state.workflowLogEntriesAsync.loading;
export const getWorkflowStepSummaryAsync = (state: State) => state.workflowStepSummaryAsync;
export const getWorkflowStepSummaryAsyncLoading = (state: State) => state.workflowStepSummaryAsync.loading;
export const getWorkflowStepApproving = (state: State) => state.approving;
export const getWorkflowStepRejecting = (state: State) => state.rejecting;
export const getWorkflowLink = (state: State) => state.workflowLink;
export const getLoading = (state: State) => state.workflowLinkLoading;
export const getLoaded = (state: State) => state.workflowLinkLoaded;
export const getWorkflow = (state: State) => state.workflow;
export const getWorkflowSaveObj = (state: State) => state.workFlowSaveObj;
export const getWorkflowSaving = (state: State) => state.saving;
export const getMessage = (state: State) => state.message;
export const getCompletedStep = (state: State) => state.completedStep;
export const getCompletedStepError = (state: State) => state.completedStepError;
