export interface TransferMethod {
  TransferMethodId: number;
  TransferMethodName: string;
  TransferMethodCode: string;
  Selected: boolean;
}

export function generateMockTransferMethod(): TransferMethod {
  return {
    TransferMethodId: 1,
    TransferMethodCode: 'MockTransferMethodCode',
    TransferMethodName: 'MockTransferMethodName',
    Selected: false
  };
}

export function generateMockTransferMethodList(): TransferMethod[] {
  return [
    {
      TransferMethodId: 1,
      TransferMethodCode: 'MockTransferMethodCode1',
      TransferMethodName: 'MockTransferMethodName1',
      Selected: true
    },
    {
      TransferMethodId: 2,
      TransferMethodCode: 'MockTransferMethodCode2',
      TransferMethodName: 'MockTransferMethodName2',
      Selected: false
    },
    {
      TransferMethodId: 3,
      TransferMethodCode: 'MockTransferMethodCode3',
      TransferMethodName: 'MockTransferMethodName3',
      Selected: false
    }
  ];
}
