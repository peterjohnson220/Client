import { CommunityUserInfo, generateMockCommunityUserInfo } from './community-user-info.model';

export interface CommunityReply {
  Id: string;
  PostId: string;
  UserInfo: CommunityUserInfo;
  ReplyText: string;
  LikeCount: number;
  LikedByCurrentUser: boolean;
  Time: any;
  TimeTicks: number;
}

export function generateMockCommunityReply(): CommunityReply {
  return {
    Id: '1234',
    PostId: '12345',
    UserInfo: generateMockCommunityUserInfo(),
    ReplyText:  'Reply Text',
    LikeCount: 0,
    LikedByCurrentUser: false,
    Time: '2 hours ago',
    TimeTicks: 12345
  };
}
