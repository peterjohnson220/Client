export interface Exchange {
  ExchangeId: number;
  ExchangeName: string;
  ExchangeManagerUserId?: number;
  Status: string;
  ExchangeType: string;
  CreateDate: Date;
  CreateUser: number;
  EditDate?: Date;
  EditUser?: number;
}

export function generateMockExchange(): Exchange {
  return {
    ExchangeId: 1,
    ExchangeName: 'Mock Exchange',
    ExchangeManagerUserId: null,
    Status: 'Active',
    ExchangeType: 'Type',
    CreateDate: new Date(1512056138449),
    CreateUser: 2437,
    EditDate: null,
    EditUser: null
  };
}
