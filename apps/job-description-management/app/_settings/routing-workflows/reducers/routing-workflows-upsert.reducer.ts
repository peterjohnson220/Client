import * as cloneDeep from 'lodash.clonedeep';
import { Permissions } from 'libs/constants';
import { WorkflowTemplate } from '../../../shared';

import * as fromWorkflowUpsertActions from '../actions';


const initialWorkflowTemplate: WorkflowTemplate = {
  Id: null,
  Name: null,
  Steps: [],
  AllAvailablePermissions: [ Permissions.JOB_DESCRIPTIONS, Permissions.CAN_EDIT_JOB_DESCRIPTION ]
};

export interface State {
    upsertModalOpen: boolean;
    template: WorkflowTemplate;
    templateSaveObj: any;
    saving: boolean;
    savingSuccess: boolean;
    savingError: boolean;
    savingErrorMessage: string;
}

export const initialState: State = {
    upsertModalOpen: false,
    templateSaveObj: null,
    template: initialWorkflowTemplate,
    saving: false,
    savingSuccess: false,
    savingError: false,
    savingErrorMessage: ''
};

export function reducer(state = initialState, action: fromWorkflowUpsertActions.UpsertActions): State {
  switch (action.type) {
    case fromWorkflowUpsertActions.BUILD_WORKFLOW_TEMPLATE_SAVE_OBJ: {
      const clonedTemplate = cloneDeep(state.template);
      clonedTemplate.Steps.map(step => {
          step.Permissions = step.Permissions.filter(p => p.selected).map(p => p.permission);
          step.WorkflowStepUsers.map(wsu => {
              wsu.Permissions = step.Permissions;
              return wsu;
          });
          return step;
      });
      return {
        ...state,
        templateSaveObj: {
          WorkflowTemplateId: 0,
          Id: clonedTemplate.Id,
          CompanyId: 0,
          Name: clonedTemplate.Name,
          Steps: clonedTemplate.Steps
        }
      };
    }
    case fromWorkflowUpsertActions.UPDATE_WORKFLOW_TEMPLATE: {
      const newtemplate = cloneDeep(state.template);
      newtemplate.Name = action.payload.name;
      newtemplate.Steps = action.payload.steps;
      return {
        ...state,
        template: newtemplate
      };
    }
    case fromWorkflowUpsertActions.SAVE_WORKFLOW_TEMPLATE: {
        return {
            ...state,
            saving: true,
            savingSuccess: false,
            savingError: false
        };
    }
    case fromWorkflowUpsertActions.SAVE_WORKFLOW_TEMPLATE_SUCCESS: {
        return {
          ...state,
          saving: false,
          savingSuccess: true,
          savingError: false
        };
    }
    case fromWorkflowUpsertActions.SAVE_WORKFLOW_TEMPLATE_ERROR: {
        return {
          ...state,
          saving: false,
          savingSuccess: false,
          savingError: true,
          savingErrorMessage: action.payload.errorMessage
        };
    }
    case fromWorkflowUpsertActions.OPEN_UPSERT_WORKFLOW_TEMPLATE_MODAL: {
        return {
          ...state,
          upsertModalOpen: true,
          template: action.payload ? action.payload : initialWorkflowTemplate
        };
    }
    case fromWorkflowUpsertActions.CLOSE_UPSERT_WORKFLOW_TEMPLATE_MODAL: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

export const getUpsertModalOpen = (state: State) => state.upsertModalOpen;
export const getSaving = (state: State) => state.saving;
export const getSavingSuccess = (state: State) => state.savingSuccess;
export const getSavingError = (state: State) => state.savingError;
export const getSavingErrorMessage = (state: State) => state.savingErrorMessage;
export const getTemplateBeingEdited = (state: State) => state.template;
export const getTemplateSaveObj = (state: State) => state.templateSaveObj;
