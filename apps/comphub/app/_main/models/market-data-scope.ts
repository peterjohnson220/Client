import { KendoDropDownItem } from './kendo-dropdown-item.model';

export interface MarketDataScope {
  Locations: KendoDropDownItem[];
  Sizes: KendoDropDownItem[];
  Industries: KendoDropDownItem[];
}

export function generateMockMarketDataScope(): MarketDataScope {
  return {
    Locations: [
      { Name: 'Aaronsburg, PA', Value: 'Aaronsburg, PA' },
      { Name: 'Abbeville, GA', Value: 'Abbeville, GA' },
      { Name: 'Boston, MA', Value: 'Boston, MA' },
      { Name: 'Burlington, MA', Value: 'Burlington, MA' },
      { Name: 'Bedford, MA', Value: 'Bedford, MA' },
      { Name: 'Groton, MA', Value: 'Groton, MA' },
      { Name: 'Acton, MA', Value: 'Acton, MA' },
      { Name: 'Littleton, MA', Value: 'Littleton, MA' },
      { Name: 'New York, NY', Value: 'New York, NY'}
    ],
    Sizes: [],
    Industries: []
  };
}
