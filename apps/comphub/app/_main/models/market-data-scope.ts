import { KendoDropDownItem } from 'libs/models/kendo/';

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
