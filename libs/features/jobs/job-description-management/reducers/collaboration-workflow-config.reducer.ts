import cloneDeep from 'lodash/cloneDeep';
import * as fromCollaborationWorkflowConfigActions from '../actions';
import { WorkflowUser } from '../models';

export interface State {
  selectedUserOrEmail: any;
  collaborationWorkflowUsers: WorkflowUser[];
}

export const initialState: State = {
  selectedUserOrEmail: null,
  collaborationWorkflowUsers: []
};

export function reducer(state = initialState,
                        action: fromCollaborationWorkflowConfigActions.CollaborationWorkflowConfigActions): State {
  switch (action.type) {
    case fromCollaborationWorkflowConfigActions.SELECT_COLLABORATION_WORKFLOW_USER_OR_EMAIL: {
      return {
        ...state,
        selectedUserOrEmail: action.payload,
      };
    }
    case fromCollaborationWorkflowConfigActions.ADD_SELECTED_USER_OR_EMAIL_TO_COLLABORATION_WORKFLOW: {
      return {
        ...state,
        collaborationWorkflowUsers: [...state.collaborationWorkflowUsers, action.payload]
      };
    }
    case fromCollaborationWorkflowConfigActions.DELETE_USER_OR_EMAIL_FROM_COLLABORATION_WORKFLOW: {
      const collaborationWorkflowUsers: WorkflowUser[] = cloneDeep(state.collaborationWorkflowUsers);
        const userIndex = collaborationWorkflowUsers.findIndex(u => u.UserId === action.payload.UserId);

        if (userIndex > -1) {
          collaborationWorkflowUsers.splice(userIndex, 1);
        }

      return {
        ...state,
        collaborationWorkflowUsers: collaborationWorkflowUsers
      };
    }
    case fromCollaborationWorkflowConfigActions.RESET_COLLABORATION_WORKFLOW: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

export const getSelectedCollaborationWorkflowUserOrEmail = (state: State) => state.selectedUserOrEmail;
export const getCollaborationWorkflowUsers = (state: State) => state.collaborationWorkflowUsers;
