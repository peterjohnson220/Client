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
