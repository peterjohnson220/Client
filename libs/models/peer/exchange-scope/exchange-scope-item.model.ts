export interface ExchangeScopeItem {
  Id: string;
  Name: string;
  Description: string;
}

export function generateMockExchangeScopeItem(): ExchangeScopeItem {
  return {
    Id: 'MockExchangeScopeItemId',
    Name: 'MockExchangeScopeItemName',
    Description: 'MockExchangeScopeItemDescription'
  };
}
