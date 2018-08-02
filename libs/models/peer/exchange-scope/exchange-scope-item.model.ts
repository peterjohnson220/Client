export interface ExchangeScopeItem {
  Id: string;
  Name: string;
}

export function generateMockExchangeScopeItem(): ExchangeScopeItem {
  return {
    Id: 'MockExchangeScopeItemId',
    Name: 'MockExchangeScopeItemName'
  };
}
