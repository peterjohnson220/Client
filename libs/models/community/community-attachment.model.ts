export interface CommunityAttachment {
  Name: string;
  FileType: string;
  Size: number;
  CloudFileName: string;
}

export function generateMockCommunityAttachment(): CommunityAttachment {
  return {
    Name: '1234',
    FileType: 'Pdf',
    Size: 123456,
    CloudFileName: 'MockName.pdf'
  };
}


