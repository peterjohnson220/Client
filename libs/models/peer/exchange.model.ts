import { StatusEnum } from '../common';

export interface Exchange {
  ExchangeId: number;
  ExchangeName: string;
  ExchangeManagerUserId?: number;
  Status: StatusEnum;
  ExchangeType: string;
  IsSystemExchange: boolean;
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
    Status: StatusEnum.Active,
    ExchangeType: 'Type',
    IsSystemExchange: false,
    CreateDate: new Date(1512056138449),
    CreateUser: 2437,
    EditDate: null,
    EditUser: null
  };
}
