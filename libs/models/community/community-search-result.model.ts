import { CommunityPost } from './community-post.model';
import { CommunityReply } from './community-reply.model';

export interface CommunitySearchResult {
  Posts:  CommunityPost[];
  FilteredReplies: CommunityReply[];
}
