import { FooterViewModel } from '../models';
import * as JdmFooterViewSettingsActions from '../actions';

export interface State {
    jdmFooterView: FooterViewModel;
    loading: boolean;
    saving: boolean;
    loadingSuccess: boolean;
    loadingError: boolean;
    savingSuccess: boolean;
    savingError: boolean;
}

const initialState: State = {
    jdmFooterView: {
      CreatedByField: true,
      CreatedDateField: true,
      CreatedDateFormatField: 'MMMM dd, yyyy',
      VersionNumberField: true,
      PageNumberField: false,
      CustomTextField: false,
      CustomTextValueField: ''
    },
    loading: false,
    saving: false,
    loadingError: false,
    savingSuccess: false,
    savingError: false,
    loadingSuccess: false
};

export function reducer (state = initialState, action: JdmFooterViewSettingsActions.Actions): State {
  switch (action.type) {
      case JdmFooterViewSettingsActions.LOAD_FOOTER_VIEW:
          return {
            ...state,
            loading: true
          };
      case JdmFooterViewSettingsActions.LOAD_FOOTER_VIEW_SUCCESS:
          return {
            ...state,
            jdmFooterView: action.payload,
            loadingSuccess: true,
            loading: false
          };
      case JdmFooterViewSettingsActions.LOAD_FOOTER_VIEW_ERROR:
          return {
            ...state,
            loadingError: true,
            loadingSuccess: false,
            loading: false
          };
      case JdmFooterViewSettingsActions.SAVE_FOOTER_VIEW:
          return {
            ...state,
            saving: true,
            savingSuccess: false,
            savingError: false
          };
      case JdmFooterViewSettingsActions.SAVE_FOOTER_VIEW_SUCCESS:
          return {
            ...state,
            jdmFooterView: action.payload,
            saving: false,
            savingSuccess: true,
            savingError: false
          };
      case JdmFooterViewSettingsActions.SAVE_FOOTER_VIEW_ERROR:
          return {
            ...state,
            saving: false,
            savingSuccess: false,
            savingError: true
          };
      default:
          return state;
  }
}

export const getJdmFooterViewObj = (state: State) => state.jdmFooterView;
export const getLoading = (state: State) => state.loading;
export const getSaving = (state: State) => state.saving;
export const getLoadingError = (state: State) => state.loadingError;
export const getSavingError = (state: State) => state.savingError;
export const getSavingSuccess = (state: State) => state.savingSuccess;
export const getLoadingSuccess = (state: State) => state.loadingSuccess;
