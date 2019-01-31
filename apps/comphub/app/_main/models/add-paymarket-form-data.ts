export interface AddPayMarketFormData {
  Name: string;
  Country: string;
  Currency: string;
  Location: string;
  Industry: string;
  Size: string;
}

export function generateMockAddPayMarketFormData(): AddPayMarketFormData {
  return {
    Name: 'Pay Market Name',
    Country: 'USA',
    Currency: 'USD',
    Location: 'Burlington, MA',
    Industry: 'Software',
    Size: '100 - 500'
  };
}
