export interface Provider {
  ProviderId: number;
  ProviderName: string;
  ProviderCode: string;
  ImageUrl: string;
  AuthenticationTypeId: number;
  Active: boolean;
  UsesFieldSelection: boolean;
  ShowInUI: boolean;
}

export function generateMockProvider(): Provider {
  return {
    ProviderId: 1,
    ProviderName: 'MockProviderName',
    ProviderCode: 'PFTEST',
    ImageUrl: 'MockImageUrl',
    AuthenticationTypeId: 1,
    Active: true,
    UsesFieldSelection: false,
    ShowInUI: true
  };
}

export function generateMockProviderList(): Provider[] {
  return [
    {
      ProviderId: 1,
      ProviderName: 'MockProviderName1',
      ProviderCode: 'MOCKCODE1',
      ImageUrl: 'MockImageUrl1',
      AuthenticationTypeId: 1,
      Active: true,
      UsesFieldSelection: false,
      ShowInUI: true
    },
    {
      ProviderId: 2,
      ProviderName: 'MockProviderName2',
      ProviderCode: 'MOCKCODE2',
      ImageUrl: 'MockImageUrl2',
      AuthenticationTypeId: 1,
      Active: true,
      UsesFieldSelection: false,
      ShowInUI: true
    },
    {
      ProviderId: 3,
      ProviderName: 'MockProviderName3',
      ProviderCode: 'MOCKCODE3',
      ImageUrl: 'MockImageUrl3',
      AuthenticationTypeId: 2,
      Active: true,
      UsesFieldSelection: false,
      ShowInUI: true
    }
  ];
}

export function generateMockOutboundProvider(): Provider {
  return {
    ProviderId: 1,
    ProviderName: 'MockProviderName',
    ProviderCode: 'PFTEST',
    ImageUrl: 'MockImageUrl',
    AuthenticationTypeId: 1,
    Active: true,
    UsesFieldSelection: false,
    ShowInUI: true
  };
}

export function generateMockOutboundProviderList(): Provider[] {
  return [
    {
      ProviderId: 1,
      ProviderName: 'MockProviderName1',
      ProviderCode: 'MOCKCODE1',
      ImageUrl: 'MockImageUrl1',
      AuthenticationTypeId: 1,
      Active: true,
      UsesFieldSelection: false,
      ShowInUI: true
    },
    {
      ProviderId: 2,
      ProviderName: 'MockProviderName2',
      ProviderCode: 'MOCKCODE2',
      ImageUrl: 'MockImageUrl2',
      AuthenticationTypeId: 1,
      Active: true,
      UsesFieldSelection: false,
      ShowInUI: true
    },
    {
      ProviderId: 3,
      ProviderName: 'MockProviderName3',
      ProviderCode: 'MOCKCODE3',
      ImageUrl: 'MockImageUrl3',
      AuthenticationTypeId: 2,
      Active: true,
      UsesFieldSelection: false,
      ShowInUI: true
    }
  ];
}
