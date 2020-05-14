import { CommunityLink } from './community-link.model';
import { CommunityAttachment } from './community-attachment.model';

export interface CommunityAddReply {
  PostId: string;
  ReplyText: string;
  Links: CommunityLink[];
  Attachments: CommunityAttachment[];
}
