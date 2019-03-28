import { ComphubPages } from '../data';
import { CountryDataSet, generateMockCountryDataSet } from './country-data.set';

export interface WorkflowContext {
  selectedPageId: ComphubPages;
  selectedPageIndex: number;
  activeCountryDataSet: CountryDataSet;
}

export function generateMockWorkflowContext(): WorkflowContext {
  return {
    selectedPageId: ComphubPages.Jobs,
    selectedPageIndex: 0,
    activeCountryDataSet: generateMockCountryDataSet()
  };
}
