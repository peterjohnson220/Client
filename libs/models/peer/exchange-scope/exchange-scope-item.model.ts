export interface ExchangeScopeItem {
  Id: string;
  ExchangeId: number;
  Name: string;
  Description: string;
  CanDelete: boolean;
}

export function generateMockExchangeScopeItem(): ExchangeScopeItem {
  return {
    Id: 'MockExchangeScopeItemId',
    ExchangeId: 1,
    Name: 'MockExchangeScopeItemName',
    Description: 'MockExchangeScopeItemDescription',
    CanDelete: true
  };
}
