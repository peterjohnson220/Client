export interface ProviderResponse {
  provider_ID: number;
  transferMethod_ID: number;
  providerName: string;
  providerCode: string;
  providerImageUrl: string;
  active: boolean;
  authenticationType_ID: number;
  showInUI: boolean;
}

export function generateMockProviderResponse(): ProviderResponse {
  return {
    provider_ID: 0,
    transferMethod_ID: 0,
    providerName: 'MockProviderName',
    providerCode: 'MockProviderCode',
    providerImageUrl: '',
    active: true,
    authenticationType_ID: 1,
    showInUI: true
  };
}

export function generateMockProviderResponseList(): ProviderResponse[] {
  return [
    {
      provider_ID: 0,
      transferMethod_ID: 0,
      providerName: 'MockProviderName0',
      providerCode: 'MockProviderCode0',
      providerImageUrl: '',
      active: true,
      authenticationType_ID: 1,
      showInUI: true
    },
    {
      provider_ID: 1,
      transferMethod_ID: 1,
      providerName: 'MockProviderName1',
      providerCode: 'MockProviderCode1',
      providerImageUrl: '',
      active: true,
      authenticationType_ID: 1,
      showInUI: true
    },
    {
      provider_ID: 2,
      transferMethod_ID: 2,
      providerName: 'MockProviderName2',
      providerCode: 'MockProviderCode2',
      providerImageUrl: '',
      active: true,
      authenticationType_ID: 1,
      showInUI: true
    }
  ];
}

export function generateMockOutboundProviderResponseList(): ProviderResponse[] {
  return [
    {
      provider_ID: 0,
      transferMethod_ID: 0,
      providerName: 'MockProviderName0',
      providerCode: 'MockProviderCode0',
      providerImageUrl: 'assets/images/workday-logo.png',
      active: true,
      authenticationType_ID: 1,
      showInUI: true
    }
  ];
}
