import {CredentialsPackage} from 'libs/models/hris-api/connection/request';

export interface PublicApiCredentialsPackage extends CredentialsPackage {
  apiKey: string;
}
