import { createSelector } from '@ngrx/store';
import * as cloneDeep from 'lodash.clonedeep';

import * as fromComphubPageActions from '../actions/comphub-page.actions';
import { AccordionCard, AccordionCards, ComphubPages } from '../data';
import { CountryDataSet, JobPricingLimitInfo, ExchangeDataSet } from '../models';

export interface State {
  cards: AccordionCard[];
  selectedPageId: ComphubPages;
  pagesAccessed: ComphubPages[];
  accessiblePages: ComphubPages[];
  jobPricingLimitInfo: JobPricingLimitInfo;
  countryDataSetLoaded: boolean;
  countryDataSets: CountryDataSet[];
  exchangeDataSets: ExchangeDataSet[];
  exchangeDataSetLoaded: boolean;
}

const initialState: State = {
  cards: AccordionCards,
  selectedPageId: ComphubPages.Jobs,
  pagesAccessed: [ComphubPages.Jobs],
  accessiblePages: [ComphubPages.Jobs],
  jobPricingLimitInfo: null,
  countryDataSetLoaded: false,
  countryDataSets: [],
  exchangeDataSets: [],
  exchangeDataSetLoaded: false
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
    case fromComphubPageActions.GET_COUNTRY_DATA_SETS_SUCCESS: {
      return {
        ...state,
        countryDataSetLoaded: true,
        countryDataSets: action.payload
      };
    }
    case fromComphubPageActions.GET_EXCHANGE_DATA_SETS_SUCCESS: {
      return {
        ...state,
        exchangeDataSetLoaded: true,
        exchangeDataSets: action.payload
      };
    }

    case fromComphubPageActions.UPDATE_ACTIVE_COUNTRY_DATA_SET: {
      return {
        ...state,
        countryDataSets: cloneDeep(state.countryDataSets).map(cds => {
          cds.Active = cds.CountryCode === action.payload;
          return cds;
        })
      };
    }

    case fromComphubPageActions.UPDATE_ACTIVE_EXCHANGE_DATA_SET: {
      return {
        ...state,
        exchangeDataSets: cloneDeep(state.exchangeDataSets).map(eds => {
          eds.Active = eds.ExchangeId === action.payload;
          return eds;
        })
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
export const getCountryDataSetsLoaded = (state: State) => state.countryDataSetLoaded;
export const getCountryDataSets = (state: State) => state.countryDataSets;
export const getExchangeDataSets = (state: State) => state.exchangeDataSets;
export const getActiveCountryDataSet = (state: State) => state.countryDataSets.find(cds => cds.Active);
export const getActiveExchangeDataSet = (state: State) => state.exchangeDataSets.find(eds => eds.Active);
export const getJobPricingBlocked = createSelector(
  getJobPricingLimitInfo,
  getActiveCountryDataSet,
  (jobPricingLimitInfo: JobPricingLimitInfo, activeCountryDataSet: CountryDataSet) => {
    return ((!!jobPricingLimitInfo && jobPricingLimitInfo.Used >= jobPricingLimitInfo.Available)
      || !activeCountryDataSet);
  }
);
