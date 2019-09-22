export interface AuthenticationType {
  AuthenticationTypeId: number;
  AuthenticationTypeName: string;
  AuthenticationCode: string;
}

export function generateMockAuthenticationType(): AuthenticationType {
  return {
    AuthenticationTypeId: 1,
    AuthenticationTypeName: 'MockAuthenticationName',
    AuthenticationCode: 'MockAuthenticationCode'
  };
}
