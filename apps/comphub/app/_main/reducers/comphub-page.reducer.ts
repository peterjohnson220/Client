import * as fromComphubPageActions from '../actions/comphub-page.actions';
import { AccordionCards, ComphubPages } from '../data';

export interface State {
  selectedPageIndex: number;
}

const initialState: State = {
  selectedPageIndex: 0
};

export function reducer(state: State = initialState, action: fromComphubPageActions.Actions) {
  switch (action.type) {
    case fromComphubPageActions.NAVIGATE_TO_CARD: {
      return {
        ...state,
        selectedPageIndex: AccordionCards.findIndex(ac => ac.Id === action.payload.cardId)
      };
    }
    case fromComphubPageActions.NAVIGATE_TO_NEXT_CARD: {
      return {
        ...state,
        selectedPageIndex: state.selectedPageIndex + 1
      };
    }
    case fromComphubPageActions.NAVIGATE_TO_PREVIOUS_CARD: {
      return {
        ...state,
        selectedPageIndex: state.selectedPageIndex - 1
      };
    }
    default: {
      return state;
    }
  }
}

export const getSelectedPageIndex = (state: State) => state.selectedPageIndex;
