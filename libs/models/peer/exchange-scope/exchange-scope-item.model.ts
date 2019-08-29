export interface ExchangeScopeItem {
  Id: string;
  Name: string;
  Description: string;
  AssociatedToPaymarket: boolean;
  CanDelete: boolean;
}

export function generateMockExchangeScopeItem(): ExchangeScopeItem {
  return {
    Id: 'MockExchangeScopeItemId',
    Name: 'MockExchangeScopeItemName',
    Description: 'MockExchangeScopeItemDescription',
    AssociatedToPaymarket: false,
    CanDelete: true
  };
}
