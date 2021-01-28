import * as fromSavedFiltersPopoverActions from '../actions/user-filter-popover.actions';

export interface State {
  popoverOpen: boolean;
}

const initialState: State = {
  popoverOpen: false
};

export function reducer(state = initialState, action: fromSavedFiltersPopoverActions.Actions): State {
  switch (action.type) {
    case fromSavedFiltersPopoverActions.OPEN_POPOVER:
      return {
        ...state,
        popoverOpen: true
      };
    case fromSavedFiltersPopoverActions.CLOSE_POPOVER:
      return {
        ...state,
        popoverOpen: false
      };
    default:
      return state;
  }
}

export const getPopoverOpen = (state: State) => state.popoverOpen;


