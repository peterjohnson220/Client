export interface CredentialsPackage {
  APIKey: string;
  Domain: string;
  UserName: string;
  Password: string;
  ProviderCode: string;
}

export function generateMockCredentialsPackage(): CredentialsPackage {
  return {
    APIKey: 'MockApiKey',
    Domain: 'MockDomain',
    UserName: 'MockUserName',
    Password: 'MockPassword',
    ProviderCode: 'MOCKCODE'
  };
}
