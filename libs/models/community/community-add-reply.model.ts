import { CommunityLink } from './community-link.model';
import { CommunityAttachment } from './community-attachment.model';

export interface CommunityAddReply {
  PostId: string;
  ReplyId?: string;
  ReplyToUserId?: number;
  ReplyToFirstName?: string;
  ReplyToLastName?: string;
  ReplyText: string;
  Links: CommunityLink[];
  Attachments: CommunityAttachment[];
}
