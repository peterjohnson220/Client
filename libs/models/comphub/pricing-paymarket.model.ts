export interface PricingPaymarket {
  CompanyPayMarketId: number;
  PayMarketName: string;
  Industry: string;
  Location: string;
  Size: string;
  SizeLabel: string;
  CurrencyCode: string;
  CountryCode?: string;
}

export function generateMockPricingPaymarket(): PricingPaymarket {
  return {
    CompanyPayMarketId: 123,
    PayMarketName: 'Boston',
    Industry: 'Software',
    Location: 'Boston, MA',
    Size: '100 - 500',
    SizeLabel: 'Employees',
    CurrencyCode: 'USD'
  };
}
