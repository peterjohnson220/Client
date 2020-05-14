import * as fromActions from '../actions/statement-assignment-modal.actions';

export interface State {
  isOpen: boolean;
}

export const initialState: State = {
  isOpen: false
};

export function reducer(state = initialState, action: fromActions.StatementAssignmentModalActions): State {
 switch (action.type) {
   case fromActions.RESET_STATE: {
     return initialState;
   }
   case fromActions.OPEN_MODAL: {
     return {
       ...state,
       isOpen: true
     };
   }
   case fromActions.CLOSE_MODAL: {
     return {
       ...state,
       isOpen: false
     };
   }
   default: {
     return state;
   }
 }
}

export const getIsOpen = (state: State) => state.isOpen;
