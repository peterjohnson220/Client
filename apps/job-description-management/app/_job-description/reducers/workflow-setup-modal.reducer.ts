import * as fromWorkflowSetupModalActions from '../actions/workflow-setup-modal.actions';

export interface State {
  saving: boolean;
  savingSuccess: boolean;
}

export const initialState: State = {
  saving: false,
  savingSuccess: false
};

export function reducer(state = initialState, action: fromWorkflowSetupModalActions.Actions): State {
  switch (action.type) {
    case fromWorkflowSetupModalActions.CREATE_WORKFLOW: {
      return {
        ...state,
        saving: true,
        savingSuccess: false
      };
    }
    case fromWorkflowSetupModalActions.CREATE_WORKFLOW_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingSuccess: true
      };
    }
    default: {
      return state;
    }
  }
}

export const getWorkflowSetupSaving = (state: State) => state.saving;
export const getWorkflowSetupSavingSuccess = (state: State) => state.savingSuccess;
