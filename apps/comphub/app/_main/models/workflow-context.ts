import { ComphubPages } from '../data';
import { CountryDataSet, generateMockCountryDataSet } from './country-data.set';
import { ExchangeDataSet, generateMockExchangeDataSet } from './exchange-data.set';
import { ComphubType } from 'libs/constants';

export interface WorkflowContext {
  selectedPageId: ComphubPages;
  selectedPageIndex: number;
  activeCountryDataSet: CountryDataSet;
  activeExchangeDataSet: ExchangeDataSet;
  comphubType: string;
}

export function generateMockWorkflowContext(): WorkflowContext {
  return {
    selectedPageId: ComphubPages.Jobs,
    selectedPageIndex: 0,
    activeCountryDataSet: generateMockCountryDataSet(),
    activeExchangeDataSet: generateMockExchangeDataSet(),
    comphubType: ComphubType.ENTERPRISE
  };
}

export function generateMockPeerWorkflowContext(): WorkflowContext {
  return {
    selectedPageId: ComphubPages.Jobs,
    selectedPageIndex: 0,
    activeCountryDataSet: generateMockCountryDataSet(),
    activeExchangeDataSet: generateMockExchangeDataSet(),
    comphubType: ComphubType.PEER
  };
}
