import { CommunityUserInfo, generateMockCommunityUserInfo } from './community-user-info.model';
import { CommunityAttachment } from './community-attachment.model';

export interface CommunityReply {
  Id: string;
  PostId: string;
  UserInfo: CommunityUserInfo;
  ReplyText: string;
  ReplyToUserId?: number;
  ReplyToFirstName?: string;
  ReplyToLastName?: string;
  LikeCount: number;
  LikedByCurrentUser: boolean;
  Time: any;
  ElapsedTime: string;
  TimeTicks: number;
  IsCurrentUserReply: boolean;
  IsOnlyPostReply: boolean;
  UserLikes: CommunityUserInfo[];
  Attachments: CommunityAttachment[];
}

export function generateMockCommunityReply(): CommunityReply {
  return {
    Id: '1234',
    PostId: '12345',
    UserInfo: generateMockCommunityUserInfo(),
    ReplyText:  'Reply Text',
    LikeCount: 0,
    LikedByCurrentUser: false,
    Time: new Date(),
    ElapsedTime: '3 hours ago',
    TimeTicks: 300,
    IsCurrentUserReply: false,
    IsOnlyPostReply: false,
    UserLikes: [],
    Attachments: []
  };
}
