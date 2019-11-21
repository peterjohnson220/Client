import * as fromViewEditActions from '../actions/view-edit.actions';

import * as cloneDeep from 'lodash.clonedeep';

import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models/state';
import { AsyncStateObjHelper } from 'libs/core/helpers';

import { ControlViewToggleObj } from '../models';

import { JobDescriptionView } from '../../shared/models';

export interface State {
  viewName: string;
  templateViewsAsyncObj: AsyncStateObj<JobDescriptionView[]>;
  controls: AsyncStateObj<any[]>;
  saving: boolean;
  savingError: boolean;
}

export const initialState: State = {
  viewName: '',
  templateViewsAsyncObj: generateDefaultAsyncStateObj<JobDescriptionView[]>([]),
  controls: generateDefaultAsyncStateObj<any[]>([]),
  saving: false,
  savingError: false
};

export function reducer(state = initialState, action: fromViewEditActions.Actions): State {
  switch (action.type) {
    case fromViewEditActions.EDIT_VIEW: {
      return {
        ...state,
        viewName: action.payload.viewName
      };
    }
    case fromViewEditActions.LOAD_TEMPLATE_VIEWS: {
      return AsyncStateObjHelper.loading(state, 'templateViewsAsyncObj');
    }
    case fromViewEditActions.LOAD_TEMPLATE_VIEWS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'templateViewsAsyncObj', action.payload);
    }
    case fromViewEditActions.LOAD_TEMPLATE_VIEWS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'templateViewsAsyncObj');
    }
    case fromViewEditActions.ADD_HIDDEN_ELEMENT_ID: {
      const newTemplateViewsAsyncObj = cloneDeep(state.templateViewsAsyncObj);
      const templateView = findTemplateView(newTemplateViewsAsyncObj, action.payload);

      templateView.HiddenElementIds.push(action.payload.ControlId);

      return {
        ...state,
        templateViewsAsyncObj: newTemplateViewsAsyncObj
      };
    }
    case fromViewEditActions.REMOVE_HIDDEN_ELEMENT_ID: {
      const newTemplateViewsAsyncObj = cloneDeep(state.templateViewsAsyncObj);
      const templateView = findTemplateView(newTemplateViewsAsyncObj, action.payload);

      templateView.HiddenElementIds = templateView.HiddenElementIds.filter(e => e !== action.payload.ControlId);

      return {
        ...state,
        templateViewsAsyncObj: newTemplateViewsAsyncObj
      };
    }
    case fromViewEditActions.GET_AVAILABLE_CONTROLS: {
      return AsyncStateObjHelper.loading(state, 'controls');
    }
    case fromViewEditActions.GET_AVAILABLE_CONTROLS_SUCCESS: {
      return AsyncStateObjHelper.loadingSuccess(state, 'controls', action.payload);
    }
    case fromViewEditActions.GET_AVAILABLE_CONTROLS_ERROR: {
      return AsyncStateObjHelper.loadingError(state, 'controls');
    }
    case fromViewEditActions.POPULATE_CONTROL_COLORS: {
      const newTemplateViewsAsyncObj = cloneDeep(state.templateViewsAsyncObj);

      newTemplateViewsAsyncObj.obj.map(tv => {
        tv.Template.Sections.map(s => {
          s.Controls.map(c => {
            c.Color = state.controls.obj.find(ct => ct.Type === c.Type).Color;
          });
        });
      });

      return {
        ...state,
        templateViewsAsyncObj: newTemplateViewsAsyncObj
      };
    }
    case fromViewEditActions.SAVE_TEMPLATE_VIEWS: {
      return {
        ...state,
        saving: true
      };
    }
    case fromViewEditActions.SAVE_TEMPLATE_VIEWS_SUCCESS: {
      return {
        ...state,
        saving: false
      };
    }
    case fromViewEditActions.SAVE_TEMPLATE_VIEWS_ERROR: {
      return {
        ...state,
        saving: false,
        savingError: true
      };
    }
    case fromViewEditActions.RESET: {
      return {
        ...initialState
      };
    }
    default:
      return state;
  }
}

function findTemplateView(templateViewsAsyncObj: AsyncStateObj<any[]>, controlViewToggleObj: ControlViewToggleObj) {
  return templateViewsAsyncObj.obj.find(v => v.Name === controlViewToggleObj.ViewName && v.TemplateId === controlViewToggleObj.TemplateId);
}

export const getViewName = (state: State) => state.viewName;
export const getTemplateViewsAsyncObj = (state: State) => state.templateViewsAsyncObj;
export const getSaving = (state: State) => state.saving;
export const getSavingError = (state: State) => state.savingError;
