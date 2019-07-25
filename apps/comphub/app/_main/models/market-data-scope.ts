import { KendoDropDownItem } from 'libs/models/kendo/kendo-dropdown-item.model';

export interface MarketDataScope {
  Sizes: KendoDropDownItem[];
  Industries: KendoDropDownItem[];
}

export function generateMockMarketDataScope(): MarketDataScope {
  return {
    Sizes: [],
    Industries: []
  };
}
