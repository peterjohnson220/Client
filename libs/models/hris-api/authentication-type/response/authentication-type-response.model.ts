export interface AuthenticationTypeResponse {
  authenticationType_ID: number;
  authenticationTypeName: string;
  authenticationTypeCode: string;
}

export function generatMockAuthenticationType(): AuthenticationTypeResponse {
  return {
    authenticationType_ID: 1,
    authenticationTypeName: 'MockAuthenticationName',
    authenticationTypeCode: 'MOCKCODE'
  };
}
