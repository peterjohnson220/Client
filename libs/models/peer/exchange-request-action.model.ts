export interface ExchangeRequestAction {
  Reason: string;
  PeopleToNotify: string;
  Action: string;
}

export function generateMockExchangeRequestAction(): ExchangeRequestAction {
  return {
    Reason: 'Because',
    PeopleToNotify: 'NoOne',
    Action: 'Deny'
  };
}
