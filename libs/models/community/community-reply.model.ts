import { CommunityUserInfo } from './community-user-info.model';

export interface CommunityReply {
  UserInfo: CommunityUserInfo;
  ReplyText: string;
  LikeCount: number;
  Time: any;
}
