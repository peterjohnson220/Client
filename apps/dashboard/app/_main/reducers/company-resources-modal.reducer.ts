import * as fromCompanyResourcesModalActions from '../actions/company-resources-modal.actions';


export interface State {
    newFolderModalOpen: boolean;
  }

  const initialState: State = {
    newFolderModalOpen: false
  };

  export function reducer(state: State = initialState, action: fromCompanyResourcesModalActions.Actions) {
    switch (action.type) {
      case fromCompanyResourcesModalActions.OPENING_NEW_FOLDER_MODAL: {
        return {
          ...state,
          newFolderModalOpen: true
        };
      }
      case fromCompanyResourcesModalActions.CLOSING_NEW_FOLDER_MODAL: {
        return {
          ...state,
          newFolderModalOpen: false
        };
      }
      default: {
        return state;
      }
    }
  }

  export const getNewFolderModalOpen = (state: State) => state.newFolderModalOpen;
