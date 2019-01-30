export interface AddPayMarketModalData {
  Name: string;
  Country: string;
  Currency: string;
  Location: string;
  Industry: string;
  Size: string;
}

export function generateMockAddPayMarketModalData(): AddPayMarketModalData {
  return {
    Name: 'Pay Market Name',
    Country: 'USA',
    Currency: 'USD',
    Location: 'Burlington, MA',
    Industry: 'Software',
    Size: '100 - 500'
  };
}
