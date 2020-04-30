import { CommunityAttachment } from './community-attachment.model';
import { CommunityTopic } from './community-topic.model';

export interface CommunityUpdatePost {
  PostId: string;
  PostText: string;
  Topic: CommunityTopic;
  Attachments: CommunityAttachment[];
}
