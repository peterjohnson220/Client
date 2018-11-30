export interface UploadedFile {
  DisplayName: string;
  FileName: string;
}

export function generateMockUploadedFile(): UploadedFile {
  return {
    DisplayName: 'test.txt',
    FileName: '13_987d0sdv_test.txt'
  };
}
