export interface ExchangeScopeItem {
  ExchangeScopeId: number;
  ExchangeId: number;
  Name: string;
  Description: string;
  CanDelete: boolean;
  IsDefault: boolean;
}

export function generateMockExchangeScopeItem(): ExchangeScopeItem {
  return {
    ExchangeScopeId: 1,
    ExchangeId: 1,
    Name: 'MockExchangeScopeItemName',
    Description: 'MockExchangeScopeItemDescription',
    CanDelete: true,
    IsDefault: false
  };
}
