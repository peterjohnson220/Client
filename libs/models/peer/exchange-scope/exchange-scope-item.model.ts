export interface ExchangeScopeItem {
  ExchangeScopeGuid: string;
  ExchangeId: number;
  Name: string;
  Description: string;
  CanDelete: boolean;
  IsDefault: boolean;
}

export function generateMockExchangeScopeItem(): ExchangeScopeItem {
  return {
    ExchangeScopeGuid: 'MockExchangeScopeItemId',
    ExchangeId: 1,
    Name: 'MockExchangeScopeItemName',
    Description: 'MockExchangeScopeItemDescription',
    CanDelete: true,
    IsDefault: false
  };
}
