import { CommunityUserInfo } from './community-user-info.model';
import { CommunityTag } from './community-tag.model';
import { CommunityReply } from './community-reply.model';

export interface CommunityPost {
  Id: string;
  UserInfo: CommunityUserInfo;
  Content: string;
  Tags: CommunityTag[];
  LikeCount: number;
  Replies: CommunityReply[];
  HasMoreReplies: Boolean;
  Time: any;
  IsInternalOnly: boolean;
}

export function generateMockCommunityPost(likeCount: number = 0, postText: string = '',
                                          tags: any = null, isInternalOnly: boolean = false,
                                          replies: CommunityReply[] = null, hasMoreReplies: boolean = false): CommunityPost {
  return {
    Id: 'testId',
    UserInfo:
      {
        UserId: 1, UserFirstName: 'Test', UserLastName: 'User', CompanyId: 2, CompanyName: 'Test Company',
        AvatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg'
      },
    Content: postText,
    Tags: tags,
    LikeCount: likeCount,
    Replies: replies,
    HasMoreReplies: hasMoreReplies,
    Time: '3 days ago',
    IsInternalOnly: isInternalOnly
  };
}
