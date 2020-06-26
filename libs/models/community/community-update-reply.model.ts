import { CommunityAttachment } from './community-attachment.model';

export interface CommunityUpdateReply {
  ReplyId: string;
  PostId: string;
  ReplyText: string;
  Attachments: CommunityAttachment[];
}
