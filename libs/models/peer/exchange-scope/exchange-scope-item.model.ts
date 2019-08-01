export interface ExchangeScopeItem {
  Id: string;
  Name: string;
  Description: string;
  CanDelete: boolean;
}

export function generateMockExchangeScopeItem(): ExchangeScopeItem {
  return {
    Id: 'MockExchangeScopeItemId',
    Name: 'MockExchangeScopeItemName',
    Description: 'MockExchangeScopeItemDescription',
    CanDelete: true
  };
}
