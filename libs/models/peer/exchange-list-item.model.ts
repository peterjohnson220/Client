export interface ExchangeListItem {
  ExchangeId: number;
  ExchangeName: string;
  CreatedBy: string;
  CreatedDate: Date;
  NumberOfCompanies: number;
}

export function generateMockExchangeListItem(): ExchangeListItem {
  return {
    ExchangeId: 1,
    ExchangeName: 'Airlines',
    CreatedBy: 'John Doe',
    CreatedDate: new Date(1512056138449),
    NumberOfCompanies: 6
  };
}
