import { KendoUploadStatus } from '../common';
import { CommunityAttachmentUploadStatus } from './community-attachment-upload-status';

export interface CommunityAttachment {
  Id: string;
  Name: string;
  FileType: string;
  Size: number;
  CloudFileName: string;
  Status: KendoUploadStatus;
}

export function generateMockCommunityAttachment(): CommunityAttachment {
  return {
    Id: '12345',
    Name: '1234',
    FileType: 'Pdf',
    Size: 123456,
    CloudFileName: 'MockName.pdf',
    Status: KendoUploadStatus.NotStarted
  };
}


