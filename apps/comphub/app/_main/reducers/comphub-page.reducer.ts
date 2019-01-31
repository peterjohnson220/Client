import * as fromComphubPageActions from '../actions/comphub-page.actions';
import { ComphubPages } from '../data';

export interface State {
  selectedPageId: string;
}

const initialState: State = {
  selectedPageId: ComphubPages.Jobs
};

export function reducer(state: State = initialState, action: fromComphubPageActions.Actions) {
  switch (action.type) {
    case fromComphubPageActions.ACCORDION_CARD_CHANGE: {
      return {
        selectedPageId: action.payload.cardId
      };
    }
    default: {
      return state;
    }
  }
}

export const getSelectedPageId = (state: State) => state.selectedPageId;
