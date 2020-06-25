import { WorkflowTemplate } from 'libs/features/job-description-management/models';

import * as fromWorkflowDeleteActions from '../actions';

export interface State {
    deleteModalOpen: boolean;
    deleting: boolean;
    deletingSuccess: boolean;
    deletingError: boolean;
    deletingErrorMessage: string;
    templateToBeDeleted: WorkflowTemplate;
}

export const initialState: State = {
    deleteModalOpen: false,
    deleting: false,
    deletingSuccess: false,
    deletingError: false,
    deletingErrorMessage: '',
    templateToBeDeleted: null
};

export function reducer(state = initialState, action: fromWorkflowDeleteActions.DeleteActions): State {
  switch (action.type) {
    case fromWorkflowDeleteActions.DELETE_WORKFLOW_TEMPLATE: {
        return {
            ...state,
            deleting: true,
            deletingError: false,
            deletingSuccess: false,
            deletingErrorMessage: ''
        };
    }
    case fromWorkflowDeleteActions.DELETE_WORKFLOW_TEMPLATE_SUCCESS: {
        return {
          ...state,
          deleting: false,
          deletingError: false,
          deletingSuccess: true,
          deleteModalOpen: false,
          templateToBeDeleted: null,
          deletingErrorMessage: ''
        };
    }
    case fromWorkflowDeleteActions.DELETE_WORKFLOW_TEMPLATE_ERROR: {
        return {
          ...state,
          deleting: false,
          deletingError: true,
          deletingSuccess: false,
          deletingErrorMessage: action.payload.errorMessage
        };
    }
    case fromWorkflowDeleteActions.OPEN_DELETE_WORKFLOW_TEMPLATE_MODAL: {
        return {
          ...state,
          deleteModalOpen: true,
          templateToBeDeleted: action.payload
        };
    }
    case fromWorkflowDeleteActions.CLOSE_DELETE_WORKFLOW_TEMPLATE_MODAL: {
      return {
        ...state,
        deleteModalOpen: false,
        deleting: false,
        deletingSuccess: false,
        deletingError: false,
        deletingErrorMessage: '',
        templateToBeDeleted: null
      };
    }
    default: {
      return state;
    }
  }
}

export const getDeleteModalOpen = (state: State) => state.deleteModalOpen;
export const getDeleting = (state: State) => state.deleting;
export const getDeletingSuccess = (state: State) => state.deletingSuccess;
export const getDeletingError = (state: State) => state.deletingError;
export const getDeletingErrorMessage = (state: State) => state.deletingErrorMessage;
export const getTemplateToBeDeleted = (state: State) => state.templateToBeDeleted;
