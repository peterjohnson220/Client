import cloneDeep from 'lodash/cloneDeep';

import {
  AsyncStateObj,
  CompositeField,
  CompositeFieldHierarchy,
  generateDefaultAsyncStateObj,
  ProjectTemplateFields
} from 'libs/models';

import * as fromProjectTemplateManagementActions from '../actions/project-template-management.actions';

export interface State {
  errorMessage: string;
  showTemplateForm: boolean;
  saving: boolean;
  templateFields: AsyncStateObj<ProjectTemplateFields>;
  projectTemplateId?: number;
}

export const initialState: State = {
  errorMessage: '',
  showTemplateForm: false,
  saving: false,
  templateFields: generateDefaultAsyncStateObj<ProjectTemplateFields>(null),
  projectTemplateId: null
};


export function reducer(state = initialState, action: fromProjectTemplateManagementActions.Actions): State {
  switch (action.type) {
    case fromProjectTemplateManagementActions.SHOW_PROJECT_TEMPLATE_FORM: {
      return {
        ...state,
        showTemplateForm: action.payload,
        errorMessage: null
      };
    }
    case fromProjectTemplateManagementActions.GET_PROJECT_TEMPLATE_FIELDS: {
      const templateFieldsClone = cloneDeep(state.templateFields);
      templateFieldsClone.loading = true;
      templateFieldsClone.loadingError = false;
      return {
        ...state,
        templateFields: templateFieldsClone,
        projectTemplateId: action.payload
      };
    }
    case fromProjectTemplateManagementActions.GET_PROJECT_TEMPLATE_FIELDS_SUCCESS: {
      const templateFieldsClone = cloneDeep(state.templateFields);
      templateFieldsClone.loading = false;
      templateFieldsClone.obj = action.payload;
      return {
        ...state,
        templateFields: templateFieldsClone
      };
    }
    case fromProjectTemplateManagementActions.GET_PROJECT_TEMPLATE_FIELDS_ERROR: {
      const templateFieldsClone = cloneDeep(state.templateFields);
      templateFieldsClone.loading = false;
      templateFieldsClone.loadingError = true;
      return {
        ...state,
        templateFields: templateFieldsClone
      };
    }
    case fromProjectTemplateManagementActions.SAVE_PROJECT_TEMPLATE_FIELDS: {
      return {
        ...state,
        saving: true,
        errorMessage: null
      };
    }
    case fromProjectTemplateManagementActions.SAVE_PROJECT_TEMPLATE_FIELDS_SUCCESS: {
      return {
        ...state,
        saving: false
      };
    }
    case fromProjectTemplateManagementActions.SAVE_PROJECT_TEMPLATE_FIELDS_ERROR: {
      return {
        ...state,
        saving: false,
        errorMessage: action.payload
      };
    }
    case fromProjectTemplateManagementActions.TOGGLE_FIELD_SELECTED: {
      const templateFieldsClone: AsyncStateObj<ProjectTemplateFields> = cloneDeep(state.templateFields);
      const fieldToUpdate = findField(action.payload, templateFieldsClone.obj.TemplateFields);
      if (fieldToUpdate) {
        fieldToUpdate.Checked = !fieldToUpdate.Checked;
      }
      return {
        ...state,
        templateFields: templateFieldsClone
      };
    }
    case fromProjectTemplateManagementActions.UPDATE_REFERENCE_POINTS: {
      const templateFieldsClone: AsyncStateObj<ProjectTemplateFields> = cloneDeep(state.templateFields);
      templateFieldsClone.obj.ReferencePoints = action.payload;
      return {
        ...state,
        templateFields: templateFieldsClone
      };
    }
    default:
      return state;
  }
}

function findField(fieldToFind: CompositeField, templateFields: CompositeFieldHierarchy[]): CompositeField {
  let result = null;
  for (let i = 0; i < templateFields.length; i++) {
    if (templateFields[i].Category === fieldToFind.Category) {
      result = templateFields[i].Fields.find(f => f.ListCompositeFieldId === fieldToFind.ListCompositeFieldId);
      break;
    }
  }
  return result;
}

export const getShowProjectTemplateForm = (state: State) => state.showTemplateForm;
export const getSavingProjectTemplate = (state: State) => state.saving;
export const getErrorMessage = (state: State) => state.errorMessage;
export const getTemplateFieldsAsync = (state: State) => state.templateFields;
