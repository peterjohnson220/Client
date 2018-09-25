import { CommunityUserInfo } from './community-user-info.model';
import { CommunityTag } from './community-tag.model';
import { CommunityReply } from './community-reply.model';

export interface CommunityPost {
  Id: string;
  Content: string;
  UserInfo: CommunityUserInfo;
  Time: any;
  IsInternalOnly: boolean;
  LikeCount: number;
  LikedByCurrentUser: boolean;
  ReplyCount: number;
  TimeTicks: number;
  Tags: CommunityTag[];
  Replies: CommunityReply[];
  ReplyIds: string[];
  HiddenReplyIds: string[];
}

export function generateMockCommunityPost(likeCount: number = 0, replyCount: number = 0, postText: string = '',
                                          tags: any = null, isInternalOnly: boolean = false,
                                          replies: CommunityReply[] = null): CommunityPost {
  return {
    Id: 'testId',
    Content: postText,
    UserInfo:
      {
        UserId: 1, UserFirstName: 'Test', UserLastName: 'User', CompanyId: 2, CompanyName: 'Test Company',
        AvatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg'
      },
    Time: new Date(),
    IsInternalOnly: isInternalOnly,
    LikeCount: likeCount,
    LikedByCurrentUser: false,
    ReplyCount: replyCount,
    TimeTicks: 12345,
    Tags: tags,
    Replies: replies,
    ReplyIds: [ '1', '2' ],
    HiddenReplyIds: [ '1' ]
  };
}
