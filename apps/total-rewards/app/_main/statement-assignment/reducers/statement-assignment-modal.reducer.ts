import * as fromActions from '../actions/statement-assignment-modal.actions';

export interface State {
  isOpen: boolean;
  assignEmployeesLoading: boolean;
  assignEmployeesError: boolean;
  assignAllEmployeesLoading: boolean;
  assignAllEmployeesError: boolean;
}

export const initialState: State = {
  isOpen: false,
  assignEmployeesLoading: false,
  assignEmployeesError: false,
  assignAllEmployeesLoading: false,
  assignAllEmployeesError: false
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
   case fromActions.ASSIGN_EMPLOYEES: {
     return {
       ...state,
       assignEmployeesLoading: true
     };
   }
   case fromActions.ASSIGN_EMPLOYEES_SUCCESS: {
     return {
       ...state,
       assignEmployeesLoading: false
     };
   }
   case fromActions.ASSIGN_EMPLOYEES_ERROR: {
     return {
       ...state,
       assignEmployeesLoading: false,
       assignEmployeesError: true
     };
   }
   case fromActions.ASSIGN_ALL_EMPLOYEES: {
     return {
       ...state,
       assignAllEmployeesLoading: true
     };
   }
   case fromActions.ASSIGN_ALL_EMPLOYEES_SUCCESS: {
     return {
       ...state,
       assignAllEmployeesLoading: false
     };
   }
   case fromActions.ASSIGN_ALL_EMPLOYEES_ERROR: {
     return {
       ...state,
       assignAllEmployeesLoading: false,
       assignAllEmployeesError: true
     };
   }
   default: {
     return state;
   }
 }
}

export const getIsOpen = (state: State) => state.isOpen;
export const getAssignEmployeesLoading = (state: State) => state.assignEmployeesLoading;
export const getAssignEmployeesError = (state: State) => state.assignEmployeesError;
export const getAssignAllEmployeesLoading = (state: State) => state.assignAllEmployeesLoading;
export const getAssignAllEmployeesError = (state: State) => state.assignAllEmployeesError;
