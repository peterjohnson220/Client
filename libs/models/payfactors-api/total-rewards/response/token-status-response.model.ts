import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { EmployeeRewardsData } from './employee-rewards-data';

export interface TokenStatusResponse {
  Status: TokenStatus;
  LockedUntil?: Date;
}

export interface DeliveryResponse extends TokenStatusResponse {
  Statement?: Statement;
  EmployeeData?: EmployeeRewardsData;
}

export enum TokenStatus {
  Valid = 'Valid',
  NotFound = 'NotFound',
  Expired = 'Expired',
  Invalid = 'Invalid',
  Locked = 'Locked'
}
