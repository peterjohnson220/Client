import { CommunityLink } from './community-link.model';

export interface CommunityAddReply {
  PostId: string;
  ReplyText: string;
  Links: CommunityLink[];
}
