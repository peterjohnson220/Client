import { ControlType } from 'libs/models';
import cloneDeep from 'lodash/cloneDeep';
import { CompanyControlEditableInfo, generateDefaultCompanyControlEditableInfo } from '../../shared/models';
import * as fromCompanyControlActions from '../actions';

export interface State {
  controlBeingViewed: ControlType;
  controlEditableInfo: CompanyControlEditableInfo;
  loading: boolean;
  saving: boolean;
  savingError: boolean;
  savingErrorMessage: string;
  unhanledError: boolean;
  readonly: boolean;
}

const initialState: State = {
  controlBeingViewed: null,
  controlEditableInfo: generateDefaultCompanyControlEditableInfo(),
  loading: false,
  saving: false,
  savingError: false,
  savingErrorMessage: '',
  unhanledError: false,
  readonly: true
};

export function reducer(state = initialState, action: fromCompanyControlActions.DetailActions): State {
  switch (action.type) {
    case fromCompanyControlActions.CREATE_CONTROL: {
      const controlType = new ControlType();
      controlType.Name = action.payload.controlName;
      controlType.ReadOnly = false;
      controlType.Attributes = [];
      return {
          ...state,
          controlBeingViewed: controlType,
          readonly: false,
      };
    }
    case fromCompanyControlActions.OPEN_COMPANY_CONTORLS_DETAIL_VIEW: {
      return {
          ...state,
          controlBeingViewed: action.control,
      };
    }
    case fromCompanyControlActions.IS_CONTROL_EDITABLE: {
        return {
            ...state,
            loading: true
        };
    }
    case fromCompanyControlActions.IS_CONTROL_EDITABLE_SUCCESS: {
        return {
          ...state,
          loading: false,
          controlEditableInfo: action.controlEditableInfo
        };
    }
    case fromCompanyControlActions.LOAD_COMPANY_CONTROL_BY_TYPE_AND_VERSION:
        return {
          ...state
        };
    case fromCompanyControlActions.LOAD_COMPANY_CONTROL_BY_TYPE_AND_VERSION_SUCCESS:
        return {
          ...state,
          controlBeingViewed: action.control
        };
    case fromCompanyControlActions.SAVE_CONTROL: {
        return {
          ...state,
          controlBeingViewed: action.control,
          saving: true
      };
    }
    case fromCompanyControlActions.SAVE_NEW_CONTROL: {
        return {
          ...state,
          controlBeingViewed: action.control,
          saving: true,
      };
    }
    case fromCompanyControlActions.SAVE_EDITED_CONTROL: {
        return {
          ...state,
          controlBeingViewed: action.control,
          saving: true,
      };
    }
    case fromCompanyControlActions.SAVE_CONTROL_SUCCESS: {
      return {
        ...state,
        saving: false,
        savingError: false,
        unhanledError: false,
        savingErrorMessage: '',
      };
    }
    case fromCompanyControlActions.SAVE_CONTROL_ERROR: {
        return {
          ...state,
          saving: false,
          savingError: true,
          savingErrorMessage: action.payload.errorMessage
        };
    }
    case fromCompanyControlActions.CHANGE_CONTROL_NAME: {
          const newControlBeingViewed = cloneDeep(state.controlBeingViewed);
          newControlBeingViewed.Name = action.payload.controlName;
          return {
            ...state,
            controlBeingViewed: newControlBeingViewed,
            readonly: false
          };
    }
    case fromCompanyControlActions.UNHANDLED_ERROR: {
        return {
          ...state,
          saving: false,
          savingError: false,
          unhanledError: true,
          savingErrorMessage: action.payload.errorMessage
        };
    }
    case fromCompanyControlActions.CLOSE_COMPANY_CONTROLS_DETAIL_VIEW: {
        return initialState;
    }
    default:
      return state;
  }
}

export const getControlBeingViewed = (state: State) => state.controlBeingViewed;
export const getControlEditableInfo = (state: State) => state.controlEditableInfo;
export const getReadonly = (state: State) => state.readonly;
export const getLoading = (state: State) => state.loading;
export const getSaving = (state: State) => state.saving;
export const getSavingError = (state: State) => state.savingError;
export const getUnhandledrror = (state: State) => state.unhanledError;
export const getSavingErrorMessage = (state: State) => state.savingErrorMessage;
