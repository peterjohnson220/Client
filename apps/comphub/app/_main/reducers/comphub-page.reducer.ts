import { createSelector } from '@ngrx/store';
import cloneDeep from 'lodash/cloneDeep';

import { ComphubType } from 'libs/constants';

import * as fromComphubPageActions from '../actions/comphub-page.actions';
import { AccordionCard, QuickPriceAccordionCards, ComphubPages, TrendsAccordionCards } from '../data';
import { CountryDataSet, JobPricingLimitInfo, ExchangeDataSet, WorkflowContext, FooterContext, JobData } from '../models';

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
  footerContext: FooterContext;
  selectedJobData: JobData;
}

const initialState: State = {
  cards: QuickPriceAccordionCards.defaultAccordionCards,
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
    comphubType: ComphubType.ENTERPRISE
  },
  isQuickPriceHistoryModalOpen: false,
  footerContext: null,
  selectedJobData: null,
};

const initialTrendsState: State = {
  cards: TrendsAccordionCards.trendAccordionCards,
  selectedPageId: ComphubPages.TrendsLanding,
  pagesAccessed: [ComphubPages.TrendsLanding],
  accessiblePages: [ComphubPages.TrendsLanding, ComphubPages.TrendsJobs, ComphubPages.TrendsScopes, ComphubPages.TrendsSummary],
  jobPricingLimitInfo: null,
  countryDataSetLoaded: false,
  countryDataSets: [],
  exchangeDataSets: [],
  exchangeDataSetLoaded: false,
  workflowContext: {
    selectedPageId: ComphubPages.TrendsLanding,
    selectedPageIndex: 0,
    activeCountryDataSet: null,
    activeExchangeDataSet: null,
    comphubType: ComphubType.TRENDS
  },
  isQuickPriceHistoryModalOpen: false,
  footerContext: null,
  selectedJobData: null,
};



export function reducer(state: State = initialState, action: fromComphubPageActions.Actions) {
  switch (action.type) {
    case fromComphubPageActions.NAVIGATE_TO_CARD: {
      const selectedPageId = state.cards.find(ac => ac.Id === action.payload.cardId).Id;
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
      const cards = state.cards;
      const nextPage = cards[cards.findIndex(ac => ac.Id === state.selectedPageId) + 1].Id;
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
      const cards = state.cards;
      const previousPage = cards[cards.findIndex(ac => ac.Id === state.selectedPageId) - 1].Id;
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
    case fromComphubPageActions.SET_COMPHUB_TYPE_IN_WORKFLOW_CONTEXT: {

      let cards: AccordionCard[];

      switch (action.payload) {
        case ComphubType.PEER:
          cards = QuickPriceAccordionCards.peerAccordionCards;
          break;
        case ComphubType.TRENDS:
          return initialTrendsState;
        default:
          cards = QuickPriceAccordionCards.defaultAccordionCards;
      }

      return {
        ...state,
        cards: cards,
        workflowContext: {
          ...state.workflowContext,
          comphubType: action.payload
        }
      };
    }
    case fromComphubPageActions.SET_QUICK_PRICE_HISTORY_MODAL_OPEN: {
      return {
        ...state,
        isQuickPriceHistoryModalOpen: action.isOpen
      };
    }
    case fromComphubPageActions.SET_FOOTER_CONTEXT: {
      return {
        ...state,
        footerContext: action.payload
      };
    }
    case fromComphubPageActions.SET_SELECTED_JOB_DATA: {
      return {
        ...state,
        selectedJobData: action.payload
      };
    }
    case fromComphubPageActions.CLEAR_SELECTED_JOB_DATA: {
      return {
        ...state,
        selectedJobData: null
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
export const getExchangeDataSetLoaded = (state: State) => state.exchangeDataSetLoaded;
export const getActiveCountryDataSet = (state: State) => state.countryDataSets.find(cds => cds.Active);
export const getActiveExchangeDataSet = (state: State) => state.exchangeDataSets.find(eds => eds.Active);
export const getWorkflowContext = (state: State) => state.workflowContext;
export const getJobPricingBlocked = createSelector(
  getJobPricingLimitInfo,
  getActiveCountryDataSet,
  getWorkflowContext,
  (jobPricingLimitInfo: JobPricingLimitInfo, activeCountryDataSet: CountryDataSet, workflowContext: WorkflowContext) => {
    return ((!!jobPricingLimitInfo && jobPricingLimitInfo.Used >= jobPricingLimitInfo.Available)
      || (!activeCountryDataSet && workflowContext.comphubType === ComphubType.ENTERPRISE));
  }
);
export const getIsQuickPriceHistoryModalOpen = (state: State) => state.isQuickPriceHistoryModalOpen;
export const getFooterContext = (state: State) => state.footerContext;
export const getSelectedJobData = (state: State) => state.selectedJobData;
export const getSmbLimitReached = createSelector(
  getJobPricingBlocked,
  getCountryDataSetsLoaded,
  getWorkflowContext,
  (jobPricingBlocked: boolean, countryDataSetsLoaded: boolean, workflowContext: WorkflowContext) => {
    return jobPricingBlocked && countryDataSetsLoaded && workflowContext.comphubType === ComphubType.SMALL_BUSINESS;
  }
);
