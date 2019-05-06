import {StatusEnum} from '../common';

export interface ExchangeListItem {
  ExchangeId: number;
  ExchangeName: string;
  Status: StatusEnum;
  CreatedBy: string;
  CreatedDate: Date;
  NumberOfCompanies: number;
  PendingAccess: boolean;
}

export function generateMockExchangeListItem(): ExchangeListItem {
  return {
    ExchangeId: 1,
    ExchangeName: 'Airlines',
    Status: StatusEnum.Active,
    CreatedBy: 'John Doe',
    CreatedDate: new Date(1512056138449),
    NumberOfCompanies: 6,
    PendingAccess: false
  };
}
