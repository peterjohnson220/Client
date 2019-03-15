import * as cloneDeep from 'lodash.clonedeep';

import * as fromComphubPageActions from '../actions/comphub-page.actions';
import { AccordionCard, AccordionCards, ComphubPages } from '../data';
import { CountryDataSet, JobPricingLimitInfo } from '../models';

export interface State {
  cards: AccordionCard[];
  selectedPageId: ComphubPages;
  pagesAccessed: ComphubPages[];
  accessiblePages: ComphubPages[];
  jobPricingLimitInfo: JobPricingLimitInfo;
  activeCountryDataSetLoaded: boolean;
  activeCountryDataSet: CountryDataSet;
}

const initialState: State = {
  cards: AccordionCards,
  selectedPageId: ComphubPages.Jobs,
  pagesAccessed: [ComphubPages.Jobs],
  accessiblePages: [ComphubPages.Jobs],
  jobPricingLimitInfo: null,
  activeCountryDataSetLoaded: false,
  activeCountryDataSet: null
};

export function reducer(state: State = initialState, action: fromComphubPageActions.Actions) {
  switch (action.type) {
    case fromComphubPageActions.NAVIGATE_TO_CARD: {
      return {
        ...state,
        selectedPageId: AccordionCards.find(ac => ac.Id === action.payload.cardId).Id
      };
    }
    case fromComphubPageActions.NAVIGATE_TO_NEXT_CARD: {
      const nextPage = AccordionCards[AccordionCards.findIndex(ac => ac.Id === state.selectedPageId) + 1].Id;

      return {
        ...state,
        selectedPageId: nextPage,
        pagesAccessed: [...state.pagesAccessed, nextPage]
      };
    }
    case fromComphubPageActions.NAVIGATE_TO_PREVIOUS_CARD: {
      const previousPage = AccordionCards[AccordionCards.findIndex(ac => ac.Id === state.selectedPageId) - 1].Id;

      return {
        ...state,
        selectedPageId: previousPage
      };
    }
    case fromComphubPageActions.ADD_ACCESSIBLE_PAGES: {
      return {
        ...state,
        accessiblePages: [...state.accessiblePages, ...action.payload]
      };
    }
    case fromComphubPageActions.REMOVE_ACCESSIBLE_PAGES: {
      return {
        ...state,
        accessiblePages: state.accessiblePages.filter(ap => !action.payload.some(p => ap === p))
      };
    }
    case fromComphubPageActions.RESET_ACCESSIBLE_PAGES: {
      return {
        ...state,
        accessiblePages: initialState.accessiblePages
      };
    }
    case fromComphubPageActions.RESET_PAGES_ACCESSED: {
      return {
        ...state,
        pagesAccessed: initialState.pagesAccessed
      };
    }
    case fromComphubPageActions.UPDATE_CARD_SUBTITLE: {
      const newCards = cloneDeep(state.cards);
      newCards.find(c => c.Id === action.payload.cardId).Subtitle = action.payload.subTitle;

      return {
        ...state,
        cards: newCards
      };
    }
    case fromComphubPageActions.SET_JOB_PRICING_LIMIT_INFO: {
      return {
        ...state,
        jobPricingLimitInfo: action.payload
      };
    }
    case fromComphubPageActions.GET_ACTIVE_COUNTRY_DATA_SET_SUCCESS: {
      return {
        ...state,
        activeCountryDataSetLoaded: true,
        activeCountryDataSet: action.payload
      };
    }
    default: {
      return state;
    }
  }
}

export const getCards = (state: State) => state.cards;
export const getSelectedPageId = (state: State) => state.selectedPageId;
export const getPagesAccessed = (state: State) => state.pagesAccessed;
export const getEnabledPages = (state: State) => {
  return state.accessiblePages.filter(ap => state.pagesAccessed.some(pa => ap === pa));
};
export const getJobPricingLimitInfo = (state: State) => state.jobPricingLimitInfo;
export const getJobPricingBlocked = (state: State) =>
  ((!!state.jobPricingLimitInfo && state.jobPricingLimitInfo.Used >= state.jobPricingLimitInfo.Available)
    || !state.activeCountryDataSet);
export const getActiveCountryDataSetLoaded = (state: State) => state.activeCountryDataSetLoaded;
export const getActiveCountryDataSet = (state: State) => state.activeCountryDataSet;
