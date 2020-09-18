import { createSelector } from '@ngrx/store';
import cloneDeep from 'lodash/cloneDeep';

import { QuickPriceType } from 'libs/constants';

import * as fromComphubPageActions from '../actions/comphub-page.actions';
import { AccordionCard, AccordionCards, ComphubPages } from '../data';
import { CountryDataSet, JobPricingLimitInfo, ExchangeDataSet, WorkflowContext } from '../models';

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
  workflowContext: WorkflowContext;
  isQuickPriceHistoryModalOpen: boolean;
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
  exchangeDataSetLoaded: false,
  workflowContext: {
    selectedPageId: ComphubPages.Jobs,
    selectedPageIndex: 0,
    activeCountryDataSet: null,
    activeExchangeDataSet: null,
    quickPriceType: QuickPriceType.ENTERPRISE
  },
  isQuickPriceHistoryModalOpen: false
};

export function reducer(state: State = initialState, action: fromComphubPageActions.Actions) {
  switch (action.type) {
    case fromComphubPageActions.NAVIGATE_TO_CARD: {
      const selectedPageId = AccordionCards.find(ac => ac.Id === action.payload.cardId).Id;
      const selectedPageIndex = state.cards.findIndex(c => c.Id === selectedPageId);
      return {
        ...state,
        workflowContext: {
          ...state.workflowContext,
          selectedPageId: selectedPageId,
          selectedPageIndex: selectedPageIndex
        },
        selectedPageId: selectedPageId
      };
    }
    case fromComphubPageActions.NAVIGATE_TO_NEXT_CARD: {
      const nextPage = AccordionCards[AccordionCards.findIndex(ac => ac.Id === state.selectedPageId) + 1].Id;
      const selectedPageIndex = state.cards.findIndex(c => c.Id === nextPage);
      return {
        ...state,
        selectedPageId: nextPage,
        workflowContext: {
          ...state.workflowContext,
          selectedPageId: nextPage,
          selectedPageIndex: selectedPageIndex
        },
        pagesAccessed: [...state.pagesAccessed, nextPage]
      };
    }
    case fromComphubPageActions.NAVIGATE_TO_PREVIOUS_CARD: {
      const previousPage = AccordionCards[AccordionCards.findIndex(ac => ac.Id === state.selectedPageId) - 1].Id;
      const selectedPageIndex = state.cards.findIndex(c => c.Id === previousPage);
      return {
        ...state,
        selectedPageId: previousPage,
        workflowContext: {
          ...state.workflowContext,
          selectedPageId: previousPage,
          selectedPageIndex: selectedPageIndex
        }
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
      const selectedPageId = state.selectedPageId;
      const selectedPageIndex = newCards.findIndex(c => c.Id === selectedPageId);
      return {
        ...state,
        cards: newCards,
        workflowContext: {
          ...state.workflowContext,
          selectedPageIndex: selectedPageIndex
        }
      };
    }
    case fromComphubPageActions.SET_JOB_PRICING_LIMIT_INFO: {
      return {
        ...state,
        jobPricingLimitInfo: action.payload
      };
    }
    case fromComphubPageActions.GET_COUNTRY_DATA_SETS_SUCCESS: {
      const activeCountryDataSet = action.payload.find(cds => cds.Active);
      return {
        ...state,
        countryDataSetLoaded: true,
        countryDataSets: action.payload,
        workflowContext: {
          ...state.workflowContext,
          activeCountryDataSet: activeCountryDataSet
        }
      };
    }
    case fromComphubPageActions.GET_EXCHANGE_DATA_SETS_SUCCESS: {
      const activeExchangeDataSet = action.payload.find(cds => cds.Active);
      return {
        ...state,
        exchangeDataSetLoaded: true,
        exchangeDataSets: action.payload,
        workflowContext: {
          ...state.workflowContext,
          activeExchangeDataSet: activeExchangeDataSet
        }
      };
    }
    case fromComphubPageActions.UPDATE_ACTIVE_COUNTRY_DATA_SET: {
      const countryDataSet = cloneDeep(state.countryDataSets).map(cds => {
        cds.Active = cds.CountryCode === action.payload;
        return cds;
      });
      const activeCountryDataSet = countryDataSet.find(cds => cds.Active);
      return {
        ...state,
        countryDataSets: countryDataSet,
        workflowContext: {
          ...state.workflowContext,
          activeCountryDataSet: activeCountryDataSet
        }
      };
    }
    case fromComphubPageActions.UPDATE_ACTIVE_EXCHANGE_DATA_SET: {
      const exchangeDataSet = cloneDeep(state.exchangeDataSets).map(eds => {
        eds.Active = eds.ExchangeId === action.payload;
        return eds;
      });
      const activeExchangeDataSet = exchangeDataSet.find(cds => cds.Active);
      return {
        ...state,
        exchangeDataSets: exchangeDataSet,
        workflowContext: {
          ...state.workflowContext,
          activeExchangeDataSet: activeExchangeDataSet
        }
      };
    }
    case fromComphubPageActions.SET_QUICK_PRICE_TYPE_IN_WORKFLOW_CONTEXT: {
      return {
        ...state,
        workflowContext: {
          ...state.workflowContext,
          quickPriceType: action.payload
        }
      };
    }
    case fromComphubPageActions.SET_QUICK_PRICE_HISTORY_MODAL_OPEN: {
      return {
        ...state,
        isQuickPriceHistoryModalOpen: action.isOpen
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
export const getWorkflowContext = (state: State) => state.workflowContext;
export const getJobPricingBlocked = createSelector(
  getJobPricingLimitInfo,
  getActiveCountryDataSet,
  getWorkflowContext,
  (jobPricingLimitInfo: JobPricingLimitInfo, activeCountryDataSet: CountryDataSet, workflowContext: WorkflowContext) => {
    return ((!!jobPricingLimitInfo && jobPricingLimitInfo.Used >= jobPricingLimitInfo.Available)
      || (!activeCountryDataSet && workflowContext.quickPriceType === QuickPriceType.ENTERPRISE));
  }
);
export const getIsQuickPriceHistoryModalOpen = (state: State) => state.isQuickPriceHistoryModalOpen;
