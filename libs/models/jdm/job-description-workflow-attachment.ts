import { KendoUploadStatus } from '../common';

export interface JobDescriptionWorkflowAttachment {
  Id: string;
  Name: string;
  FileType: string;
  Size: number;
  CloudFileName: string;
  Status: KendoUploadStatus;
}

export function generateMockJobDescriptionWorkflowAttachment(status: KendoUploadStatus): JobDescriptionWorkflowAttachment {
  return {
    Id: '12345',
    Name: '1234',
    FileType: 'Pdf',
    Size: 123456,
    CloudFileName: 'MockName.pdf',
    Status: status
  };
}

