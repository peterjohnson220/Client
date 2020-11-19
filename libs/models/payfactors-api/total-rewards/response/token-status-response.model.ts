import { Statement } from 'libs/features/total-rewards/total-rewards-statement/models';
import { EmployeeRewardsData } from './employee-rewards-data';

export interface TokenStatusResponse {
  Status: TokenStatus;
  LockedUntil?: Date;
  NotificationsToken: string;
}

export interface DeliveryResponse extends TokenStatusResponse {
  Statement?: Statement;
  EmployeeData?: EmployeeRewardsData;
}

export interface StatementDownloadResponse {
  FileDownloadLink?: string;
  NotificationId: string;
}

export enum TokenStatus {
  Valid = 'Valid',
  NotFound = 'NotFound',
  Expired = 'Expired',
  Invalid = 'Invalid',
  Locked = 'Locked'
}
