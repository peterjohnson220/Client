import cloneDeep from 'lodash/cloneDeep';

import {
  AsyncStateObj, BaseProjectFields,
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
  projectTemplateId?: number;
  templateName: string;
  projectFields: AsyncStateObj<BaseProjectFields>;
}

export const initialState: State = {
  errorMessage: '',
  showTemplateForm: false,
  saving: false,
  projectTemplateId: null,
  templateName: '',
  projectFields: generateDefaultAsyncStateObj<BaseProjectFields>(null)
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
      const fieldsClone = cloneDeep(state.projectFields);
      fieldsClone.loading = true;
      fieldsClone.loadingError = false;
      return {
        ...state,
        projectFields: fieldsClone,
        projectTemplateId: action.payload
      };
    }
    case fromProjectTemplateManagementActions.GET_PROJECT_TEMPLATE_FIELDS_SUCCESS: {
      const fieldsClone = cloneDeep(state.projectFields);
      fieldsClone.loading = false;
      fieldsClone.obj = action.payload.Fields;
      return {
        ...state,
        projectFields: fieldsClone,
        templateName: action.payload.TemplateName
      };
    }
    case fromProjectTemplateManagementActions.GET_PROJECT_TEMPLATE_FIELDS_ERROR: {
      const fieldsClone = cloneDeep(state.projectFields);
      fieldsClone.loading = false;
      fieldsClone.loadingError = true;
      return {
        ...state,
        projectFields: fieldsClone
      };
    }
    case fromProjectTemplateManagementActions.SAVE_BASE_PROJECT_FIELD_SELECTIONS:
    case fromProjectTemplateManagementActions.SAVE_PROJECT_TEMPLATE_FIELDS: {
      return {
        ...state,
        saving: true,
        errorMessage: null
      };
    }
    case fromProjectTemplateManagementActions.SAVE_BASE_PROJECT_FIELD_SELECTIONS_SUCCESS:
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
      const fieldsClone: AsyncStateObj<BaseProjectFields> = cloneDeep(state.projectFields);
      const fieldToUpdate = findField(action.payload, fieldsClone.obj.TemplateFields);
      if (fieldToUpdate) {
        fieldToUpdate.Checked = !fieldToUpdate.Checked;
      }
      return {
        ...state,
        projectFields: fieldsClone
      };
    }
    case fromProjectTemplateManagementActions.UPDATE_REFERENCE_POINTS: {
      const fieldsClone: AsyncStateObj<BaseProjectFields> = cloneDeep(state.projectFields);
      fieldsClone.obj.ReferencePoints = action.payload;
      return {
        ...state,
        projectFields: fieldsClone
      };
    }
    case fromProjectTemplateManagementActions.TOGGLE_SELECT_ALL: {
      const fieldsClone: AsyncStateObj<BaseProjectFields> = cloneDeep(state.projectFields);
      fieldsClone.obj.TemplateFields.find(x => x.Category === action.payload.Category).Fields.forEach(x => {
        x.Checked = action.payload.SelectAllValue;
      });

      return {
        ...state,
        projectFields: fieldsClone
      };
    }
    case fromProjectTemplateManagementActions.SET_BASE_PROJECT_FIELDS: {
      return {
        ...state,
        projectFields: generateDefaultAsyncStateObj<BaseProjectFields>(action.payload)
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
export const getTemplateFieldsAsync = (state: State) => generateDefaultAsyncStateObj<ProjectTemplateFields>(buildTemplateObjectFromState(state));
export const getProjectTemplateId = (state: State) => state.projectTemplateId;

function buildTemplateObjectFromState(state: State): ProjectTemplateFields {
  return {
    ProjectTemplateId: state.projectTemplateId,
    TemplateName: state.templateName,
    Fields: {
      TemplateFields: state.projectFields?.obj?.TemplateFields,
      ReferencePoints: state.projectFields?.obj?.ReferencePoints
    }
  };
}
