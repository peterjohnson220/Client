import { AsyncStateObjHelper } from 'libs/core';
import { AsyncStateObj, generateDefaultAsyncStateObj } from 'libs/models';

import * as fromCompanyControlsActions from '../actions';
import { TemplateNameAndStatusModel } from '../models';

export interface State {
    deletingControlSuccess: boolean;
    deletingControlError: boolean;
    deletingControlErrorMessage: string;
    templatesWithControlTypeObj: AsyncStateObj<TemplateNameAndStatusModel[]>;
}

export const initialState: State = {
    deletingControlSuccess: false,
    deletingControlError: false,
    deletingControlErrorMessage: '',
    templatesWithControlTypeObj: generateDefaultAsyncStateObj<TemplateNameAndStatusModel[]>([])
};

export function reducer(state = initialState, action: fromCompanyControlsActions.DeleteActions): State {
  switch (action.type) {
    case fromCompanyControlsActions.DELETE_CONTROL: {
        return {
            ...state,
        };
    }
    case fromCompanyControlsActions.DELETE_CONTROL_SUCCESS: {
        return {
          ...state,
          deletingControlSuccess: true,
          templatesWithControlTypeObj: generateDefaultAsyncStateObj<TemplateNameAndStatusModel[]>([])
        };
    }
    case fromCompanyControlsActions.DELETE_CONTROL_ERROR: {
        return {
          ...state,
          deletingControlSuccess: false,
          deletingControlError: true,
          deletingControlErrorMessage: action.payload
        };
    }
    case fromCompanyControlsActions.CLOSE_DELETE_CONTROL_MODAL: {
      return {
        ...state,
        deletingControlSuccess: false,
        deletingControlError: false,
        deletingControlErrorMessage: '',
        templatesWithControlTypeObj: generateDefaultAsyncStateObj<TemplateNameAndStatusModel[]>([])
      };
    }
    case fromCompanyControlsActions.LOAD_TEMPLATES_WITH_CONTROL_TYPE: {
        return AsyncStateObjHelper.loading(state, 'templatesWithControlTypeObj');
    }
    case fromCompanyControlsActions.LOAD_TEMPLATES_WITH_CONTROL_TYPE_SUCCESS: {
        return AsyncStateObjHelper.loadingSuccess(state, 'templatesWithControlTypeObj', action.payload);
    }
    case fromCompanyControlsActions.LOAD_TEMPLATES_WITH_CONTROL_TYPE_ERROR: {
        return AsyncStateObjHelper.loadingError(state, 'templatesWithControlTypeObj');
    }
    default: {
      return state;
    }
  }
}

export const getDeletingControlSuccess = (state: State) => state.deletingControlSuccess;
export const getDeletingControlError = (state: State) => state.deletingControlError;
export const getDeletingControlErrorMessage = (state: State) => state.deletingControlErrorMessage;
export const getTemplateWithControlType = (state: State) => state.templatesWithControlTypeObj;


