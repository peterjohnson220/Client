export interface CountryDataSet {
  CountryCode: string;
  CountryName: string;
  CurrencyCode: string;
  GeoLabel: string;
}

export function generateMockCountryDataSet(): CountryDataSet {
  return {
    CountryCode: 'USA',
    CountryName: 'United States',
    CurrencyCode: 'USD',
    GeoLabel: 'CityState'
  };
}
