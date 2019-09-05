import { generateMockCredentialsPackage, CredentialsPackage } from './credentials-package.model';
import { Connection, generateMockConnection } from '../connection.model';

export interface ConnectionPostRequest {
  connection: Connection;
  credentialsPackage: CredentialsPackage;
}

export function generateMockConnectionPostRequest(): ConnectionPostRequest {
  return {
    connection: generateMockConnection(),
    credentialsPackage: generateMockCredentialsPackage()
  };
}
