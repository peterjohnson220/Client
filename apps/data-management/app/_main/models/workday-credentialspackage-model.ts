import { CredentialsPackage } from 'libs/models/hris-api/connection/request';

export interface WorkdaySoapCredentialsPackage extends CredentialsPackage {
  Domain: string;
  UserName: string;
  Password: string;
}
