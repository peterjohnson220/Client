export interface RequestExchangeAccessRequest {
  ExchangeId: number;
  Reason: string;
}

export function generateMockRequestExchangeAccessRequest(): RequestExchangeAccessRequest {
  return {
    ExchangeId: 1,
    Reason: 'Mock Reason'
  };
}
