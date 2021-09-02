import { ComphubType } from 'libs/constants';
import { ExchangeDataSet, generateMockExchangeDataSet } from 'libs/models/comphub/exchange-data.set';

import { CountryDataSet, generateMockCountryDataSet } from './country-data.set';
import { ComphubPages } from '../data';

export interface WorkflowContext {
  lastAccessedPageId: ComphubPages;
  selectedPageId: ComphubPages;
  selectedPageIndex: number;
  activeCountryDataSet: CountryDataSet;
  activeExchangeDataSet: ExchangeDataSet;
  comphubType: string;
}

export function generateMockWorkflowContext(): WorkflowContext {
  return {
    lastAccessedPageId: null,
    selectedPageId: ComphubPages.Jobs,
    selectedPageIndex: 0,
    activeCountryDataSet: generateMockCountryDataSet(),
    activeExchangeDataSet: generateMockExchangeDataSet(),
    comphubType: ComphubType.ENTERPRISE
  };
}

export function generateMockPeerWorkflowContext(): WorkflowContext {
  return {
    lastAccessedPageId: null,
    selectedPageId: ComphubPages.Jobs,
    selectedPageIndex: 0,
    activeCountryDataSet: generateMockCountryDataSet(),
    activeExchangeDataSet: generateMockExchangeDataSet(),
    comphubType: ComphubType.PEER
  };
}

export function generateMockCrowdSourcedWorkflowContext(): WorkflowContext {
  return {
    lastAccessedPageId: null,
    selectedPageId: ComphubPages.Jobs,
    selectedPageIndex: 0,
    activeCountryDataSet: generateMockCountryDataSet(),
    activeExchangeDataSet: generateMockExchangeDataSet(),
    comphubType: ComphubType.CROWD_SOURCED_DATA
  };
}
