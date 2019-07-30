import { CommunityLink } from './community-link.model';
import { CommunityTopic } from './community-topic.model';

export interface CommunityAddPost {
  PostText: string;
  IsInternalOnly: boolean;
  Links: CommunityLink[];
  TopicId: string;
}
