import { CommunityUserInfo } from './community-user-info.model';

export interface CommunityReply {
  PostId: string;
  UserInfo: CommunityUserInfo;
  ReplyText: string;
  LikeCount: number;
  Time: any;
}
