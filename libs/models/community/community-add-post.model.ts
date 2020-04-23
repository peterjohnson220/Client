import { CommunityLink } from './community-link.model';
import { CommunityTopic } from './community-topic.model';
import { CommunityAttachment } from './community-attachment.model';

export interface CommunityAddPost {
  PostText: string;
  IsInternalOnly: boolean;
  Links: CommunityLink[];
  TopicId: string;
  Attachments: CommunityAttachment[];
}
