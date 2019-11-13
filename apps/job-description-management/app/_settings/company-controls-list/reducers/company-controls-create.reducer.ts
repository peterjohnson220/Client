import * as fromCompanyControlsCreateActions from '../actions/company-controls-create.actions';

export interface State {
    createControlModalOpen: boolean;
    creatingControl: boolean;
    creatingControlError: boolean;
    creatingControlErrorMessage: string;
}

export const initialState: State = {
    createControlModalOpen: false,
    creatingControl: false,
    creatingControlError: false,
    creatingControlErrorMessage: ''
};

export function reducer(state = initialState, action: fromCompanyControlsCreateActions.CreateActions): State {
  switch (action.type) {
    case fromCompanyControlsCreateActions.CREATE_CONTROL: {
        return {
            ...state,
            creatingControl: true,
            creatingControlError: false
        };
    }
    case fromCompanyControlsCreateActions.CREATE_CONTROL_SUCCESS: {
        return {
          ...state,
          createControlModalOpen: false,
          creatingControl: false,
          creatingControlError: false
        };
    }
    case fromCompanyControlsCreateActions.CREATE_CONTROL_ERROR: {
        return {
          ...state,
          creatingControl: false,
          creatingControlError: true,
          creatingControlErrorMessage: action.payload
        };
    }
    case fromCompanyControlsCreateActions.OPEN_CREATE_CONTROL_MODAL: {
        return {
          ...state,
          createControlModalOpen: true
        };
    }
    case fromCompanyControlsCreateActions.CLOSE_CREATE_CONTROL_MODAL: {
      return {
        ...state,
        creatingControl: false,
        createControlModalOpen: false
      };
    }
    default: {
      return state;
    }
  }
}

export const getCreateControlModalOpen = (state: State) => state.createControlModalOpen;
export const getCreatingControl = (state: State) => state.creatingControl;
export const getCreatingControlError = (state: State) => state.creatingControlError;
export const getCreatingControlErrorMessage = (state: State) => state.creatingControlErrorMessage;
