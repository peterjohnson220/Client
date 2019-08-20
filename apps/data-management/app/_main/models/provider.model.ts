export interface Provider {
  ProviderId: number;
  ProviderName: string;
  ProviderCode: string;
  ImageUrl: string;
}

export function generateMockProvider(): Provider {
  return {
    ProviderId: 1,
    ProviderName: 'MockProviderName',
    ProviderCode: 'MockProviderCode',
    ImageUrl: 'MockImageUrl'
  };
}

export function generateMockProviderList(): Provider[] {
  return [
    {
      ProviderId: 1,
      ProviderName: 'MockProviderName1',
      ProviderCode: 'MockProviderCode1',
      ImageUrl: 'MockImageUrl1'
    },
    {
      ProviderId: 2,
      ProviderName: 'MockProviderName2',
      ProviderCode: 'MockProviderCode2',
      ImageUrl: 'MockImageUrl2'
    },
    {
      ProviderId: 3,
      ProviderName: 'MockProviderName3',
      ProviderCode: 'MockProviderCode3',
      ImageUrl: 'MockImageUrl3'
    }
  ];
}
