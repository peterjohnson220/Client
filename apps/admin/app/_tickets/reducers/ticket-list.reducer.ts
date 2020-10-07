import * as fromTicketListActions from '../actions/ticket-list.actions';
import { UserTicketGridItem } from '../models';
import { GridDataResult } from '@progress/kendo-angular-grid';

// Extended entity state
export interface State {
  initSuccess: boolean;
  loading: boolean;
  loadingError: boolean;
  dirty: boolean;
  gridData: GridDataResult;
}

// Initial State
const initialState: State = {
  initSuccess: false,
  loading: true,
  loadingError: false,
  dirty: false,
  gridData: null
};

export function reducer(state = initialState, action: fromTicketListActions.Actions): State {

  switch (action.type) {
    case fromTicketListActions.INIT_TICKETS_SUCCESS: {
      return {
        ...state,
        initSuccess: true
      };
    }
    case fromTicketListActions.LOAD_TICKETS: {
      return {
        ...state,
        loading: true,
        loadingError: false
      };
    }
    case fromTicketListActions.LOAD_TICKETS_SUCCESS: {
      return {
        ...state,
        gridData: action.payload,
        loadingError: false,
        loading: false,
        dirty: false
      };
    }
    case fromTicketListActions.LOAD_TICKETS_ERROR: {
      return {
        ...state,
        loading: false,
        loadingError: true
      };
    }
    case fromTicketListActions.SET_GRID_DIRTY_STATUS: {
      return {
        ...state,
        dirty: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export const getInitSuccess = (state: State) => state.initSuccess;
export const getLoading = (state: State) => state.loading;
export const getLoadingError = (state: State) => state.loadingError;
export const getDirtyGridState = (state: State) => state.dirty;
export const getData = (state: State) => state.gridData;
