import { KendoDropDownItem } from './kendo-dropdown-item.model';

export interface AddPayMarketFormData {
  Name: string;
  Country: string;
  Currency: string;
  Location: string;
  Industry: string;
  Size: string;
  GeoLabel: string;
}

export function generateMockAddPayMarketFormData(): AddPayMarketFormData {
  return {
    Name: 'Pay Market Name',
    Country: 'USA',
    Currency: 'USD',
    Location: 'Burlington, MA',
    Industry: 'Software',
    Size: '100 - 500',
    GeoLabel: 'CityState'
  };
}
