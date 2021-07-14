import { QuickPriceType } from 'libs/constants';
import { ExchangeDataSet, generateMockExchangeDataSet } from 'libs/models/comphub/exchange-data.set';

import { CountryDataSet, generateMockCountryDataSet } from './country-data.set';
import { ComphubPages } from '../data';

export interface WorkflowContext {
  selectedPageId: ComphubPages;
  selectedPageIndex: number;
  activeCountryDataSet: CountryDataSet;
  activeExchangeDataSet: ExchangeDataSet;
  quickPriceType: string;
}

export function generateMockWorkflowContext(): WorkflowContext {
  return {
    selectedPageId: ComphubPages.Jobs,
    selectedPageIndex: 0,
    activeCountryDataSet: generateMockCountryDataSet(),
    activeExchangeDataSet: generateMockExchangeDataSet(),
    quickPriceType: QuickPriceType.ENTERPRISE
  };
}

export function generateMockPeerWorkflowContext(): WorkflowContext {
  return {
    selectedPageId: ComphubPages.Jobs,
    selectedPageIndex: 0,
    activeCountryDataSet: generateMockCountryDataSet(),
    activeExchangeDataSet: generateMockExchangeDataSet(),
    quickPriceType: QuickPriceType.PEER
  };
}

export function generateMockCrowdSourcedWorkflowContext(): WorkflowContext {
  return {
    selectedPageId: ComphubPages.Jobs,
    selectedPageIndex: 0,
    activeCountryDataSet: generateMockCountryDataSet(),
    activeExchangeDataSet: generateMockExchangeDataSet(),
    quickPriceType: QuickPriceType.CROWD_SOURCED_DATA
  };
}
