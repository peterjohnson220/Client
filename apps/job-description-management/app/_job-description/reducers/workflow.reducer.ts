import * as cloneDeep from 'lodash.clonedeep';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';

import * as fromWorkflowActions from '../actions/workflow.actions';
import { WorkflowLogEntry, WorkflowStepSummaryItem } from '../models';

export interface State {
  workflowLogEntriesAsync: AsyncStateObj<WorkflowLogEntry[]>;
  workflowStepSummaryAsync: AsyncStateObj<WorkflowStepSummaryItem[]>;
  approving: boolean;
  rejecting: boolean;
  workflowLinkLoading: boolean;
  workflowLinkLoaded: boolean;
  workflowLink: string;
}

export const initialState: State = {
  workflowLogEntriesAsync: generateDefaultAsyncStateObj<WorkflowLogEntry[]>([]),
  workflowStepSummaryAsync: generateDefaultAsyncStateObj<WorkflowStepSummaryItem[]>([]),
  approving: false,
  rejecting: false,
  workflowLinkLoading: false,
  workflowLinkLoaded: false,
  workflowLink: ''
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
        rejecting: false
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
