export interface CountryDataSet {
  CountryCode: string;
  CountryName: string;
  CurrencyCode: string;
  Active: boolean;
  FlagCode: string;
}

export function generateMockCountryDataSet(): CountryDataSet {
  return {
    CountryCode: 'USA',
    CountryName: 'United States',
    CurrencyCode: 'USD',
    Active: true,
    FlagCode: 'us'
  };
}
