export interface TransferMethodResponse {
  transferMethod_ID: number;
  transferMethodName: string;
  transferMethodCode: string;
  active: boolean;
}

export function generateMockTransferMethodResponse(): TransferMethodResponse {
  return {
    transferMethod_ID: 0,
    transferMethodName: 'MockTransferMethodName',
    transferMethodCode: 'MockTransferMethodCode',
    active: true
  };
}

export function generateMockTransferMethodResponseList(): TransferMethodResponse[] {
  return [
    {
      transferMethod_ID: 0,
      transferMethodName: 'MockTransferMethodName0',
      transferMethodCode: 'MockTransferMethodCode0',
      active: true
    },
    {
      transferMethod_ID: 1,
      transferMethodName: 'MockTransferMethodName1',
      transferMethodCode: 'MockTransferMethodCode1',
      active: true
    },
    {
      transferMethod_ID: 2,
      transferMethodName: 'MockTransferMethodName2',
      transferMethodCode: 'MockTransferMethodCode2',
      active: true
    }
  ];
}

export function generateMockOutboundTransferMethodResponseList(): TransferMethodResponse[] {
  return [
    {
      transferMethod_ID: 0,
      transferMethodName: 'hris integration',
      transferMethodCode: 'MockTransferMethodCode0',
      active: true
    },
    {
      transferMethod_ID: 1,
      transferMethodName: 'MockTransferMethodName1',
      transferMethodCode: 'MockTransferMethodCode1',
      active: true
    },
    {
      transferMethod_ID: 2,
      transferMethodName: 'MockTransferMethodName2',
      transferMethodCode: 'MockTransferMethodCode2',
      active: true
    }
  ];
}
