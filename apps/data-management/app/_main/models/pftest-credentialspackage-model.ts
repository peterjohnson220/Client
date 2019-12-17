import { CredentialsPackage } from 'libs/models/hris-api/connection/request';

export interface PfTestCredentialsPackage extends CredentialsPackage {
  UserName: string;
  Password: string;
}
