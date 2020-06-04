import { CommunityAttachment } from './community-attachment.model';

// Represents single community attachment modal dialog and its state
export interface CommunityAttachmentModalState {
  Id: string;
  Attachments: CommunityAttachment[];
  IsModalOpen: boolean;
}

export function generateMockCommunityAttachmentModal(): CommunityAttachmentModalState {
  return {
    Id: '1234',
    Attachments: [],
    IsModalOpen: true
  };
}


