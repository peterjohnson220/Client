export interface ExchangeScopeItem {
  Id: string;
  Name: string;
  Description: string;
  AssociatedToPaymarket: boolean;
}

export function generateMockExchangeScopeItem(): ExchangeScopeItem {
  return {
    Id: 'MockExchangeScopeItemId',
    Name: 'MockExchangeScopeItemName',
    Description: 'MockExchangeScopeItemDescription',
    AssociatedToPaymarket: false
  };
}
