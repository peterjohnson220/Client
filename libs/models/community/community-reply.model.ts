import { CommunityUserInfo, generateMockCommunityUserInfo } from './community-user-info.model';

export interface CommunityReply {
  PostId: string;
  UserInfo: CommunityUserInfo;
  ReplyText: string;
  LikeCount: number;
  Time: any;
}

export function generateMockCommunityReply(): CommunityReply {
  return {
    PostId: '12345',
    UserInfo: generateMockCommunityUserInfo(),
    ReplyText:  'Reply Text',
    LikeCount: 0,
    Time: '2 hours ago'
  };
}
