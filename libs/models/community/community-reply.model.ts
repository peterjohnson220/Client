import { CommunityUserInfo, generateMockCommunityUserInfo } from './community-user-info.model';

export interface CommunityReply {
  Id: string;
  PostId: string;
  UserInfo: CommunityUserInfo;
  ReplyText: string;
  LikeCount: number;
  Time: any;
}

export function generateMockCommunityReply(): CommunityReply {
  return {
    Id: '1234',
    PostId: '12345',
    UserInfo: generateMockCommunityUserInfo(),
    ReplyText:  'Reply Text',
    LikeCount: 0,
    Time: '2 hours ago'
  };
}
