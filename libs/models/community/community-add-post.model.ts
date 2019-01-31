import { CommunityLink } from './community-link.model';

export interface CommunityAddPost {
  PostText: string;
  IsInternalOnly: boolean;
  Links: CommunityLink[];
}
