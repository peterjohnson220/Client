import { FooterViewModel } from '../models';
import * as JdmFooterViewSettingsActions from '../actions';

export interface State {
    jdmFooterView: FooterViewModel;
    loadingError: boolean;
    savingSuccess: boolean;
    savingError: boolean;
}

const initialState: State = {
    jdmFooterView: {
      CreatedByField: true,
      CreatedDateField: true,
      VersionNumberField: true,
      PageNumberField: false,
      CustomTextField: false,
      CustomTextValueField: ''
    },
    loadingError: false,
    savingSuccess: false,
    savingError: false
};

const emptyFooterView: FooterViewModel = {
  CreatedByField: false,
    CreatedDateField: false,
    VersionNumberField: false,
    PageNumberField: false,
    CustomTextField: false,
    CustomTextValueField: ''
};

export function reducer (state = initialState, action: JdmFooterViewSettingsActions.Actions): State {
  switch (action.type) {
      case JdmFooterViewSettingsActions.LOAD_FOOTER_VIEW:
          return {
            ...state,
          };
      case JdmFooterViewSettingsActions.LOAD_FOOTER_VIEW_SUCCESS:
          return {
            ...state,
            jdmFooterView: action.payload,
          };
      case JdmFooterViewSettingsActions.LOAD_FOOTER_VIEW_ERROR:
          return {
            ...state,
            jdmFooterView: emptyFooterView,
            loadingError: true
          };
      case JdmFooterViewSettingsActions.SAVE_FOOTER_VIEW:
          return {
            ...state,
            savingSuccess: false,
            savingError: false
          };
      case JdmFooterViewSettingsActions.SAVE_FOOTER_VIEW_SUCCESS:
          return {
            ...state,
            jdmFooterView: action.payload,
            savingSuccess: true,
            savingError: false
          };
      case JdmFooterViewSettingsActions.SAVE_FOOTER_VIEW_ERROR:
          return {
            ...state,
            savingSuccess: false,
            savingError: true
          };
      default:
          return state;
  }
}

export const getJdmFooterViewObj = (state: State) => state.jdmFooterView;
export const getLoadingError = (state: State) => state.loadingError;
export const getSavingError = (state: State) => state.savingError;
export const getSavingSuccess = (state: State) => state.savingSuccess;
