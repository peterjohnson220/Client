export interface Provider {
  ProviderId: number;
  ProviderName: string;
  ProviderCode: string;
  ImageUrl: string;
  AuthenticationTypeId: number;
}

export function generateMockProvider(): Provider {
  return {
    ProviderId: 1,
    ProviderName: 'MockProviderName',
    ProviderCode: 'PFTEST',
    ImageUrl: 'MockImageUrl',
    AuthenticationTypeId: 1
  };
}

export function generateMockProviderList(): Provider[] {
  return [
    {
      ProviderId: 1,
      ProviderName: 'MockProviderName1',
      ProviderCode: 'MOCKCODE1',
      ImageUrl: 'MockImageUrl1',
      AuthenticationTypeId: 1
    },
    {
      ProviderId: 2,
      ProviderName: 'MockProviderName2',
      ProviderCode: 'MOCKCODE2',
      ImageUrl: 'MockImageUrl2',
      AuthenticationTypeId: 1
    },
    {
      ProviderId: 3,
      ProviderName: 'MockProviderName3',
      ProviderCode: 'MOCKCODE3',
      ImageUrl: 'MockImageUrl3',
      AuthenticationTypeId: 2
    }
  ];
}
