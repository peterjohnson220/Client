import * as fromJobDescriptionNavigationActions from '../actions/job-description-navigation.actions';

export interface State {
  navigatedToSettings: any;
}

export const initialState: State = {
  navigatedToSettings: {source: 'job-descriptions', templateId: null}
};

export function reducer(state = initialState, action: fromJobDescriptionNavigationActions.Actions): State {
  switch (action.type) {
    case fromJobDescriptionNavigationActions.NAVIGATE_TO_SETTINGS_FROM_JDM_LIST:
      return {
        ...state,
        navigatedToSettings: {source: 'job-descriptions', templateId: null}
      };
      case fromJobDescriptionNavigationActions.NAVIGATE_TO_SETTINGS_FROM_TEMPLATE_LIST:
        return {
          ...state,
          navigatedToSettings: {source: 'templates', templateId: null}
        };
      case fromJobDescriptionNavigationActions.NAVIGATE_TO_SETTINGS_FROM_TEMPLATE:
        return {
          ...state,
          navigatedToSettings: {source: 'templates', templateId: action.templateId}
        };
    default: {
      return state;
    }
  }
}

export const getNavigatedToSettings = (state: State) => state.navigatedToSettings;
