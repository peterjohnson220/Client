export interface CommunityPost {
  UserInfo: CommunityUserInfo;
  PostText: string;
  Tags: CommunityTag[];
  LikeCount: number;
  Replies: CommunityReply[];
  HasMoreReplies: Boolean;
  Time: any;
  IsInternalOnly: boolean;
}

export interface CommunityUserInfo {
  userId: number;
  companyId: number;
  userFirstName: string;
  userLastName: string;
  companyName: string;
  avatarSource: string;
}

export interface CommunityTag {
  TagId: any;
  TagName: string;
}

export interface CommunityReply {
  UserInfo: CommunityUserInfo;
  ReplyText: string;
  LikeCount: number;
  Time: any;
}

export function generateMockCommunityPost(likeCount: number = 0, postText: string = '',
                                          tags: any = null, isInternalOnly: boolean = false,
                                          replies: CommunityReply[] = null, hasMoreReplies: boolean = false): CommunityPost {
  return {
    UserInfo:
      {
        userId: 1, userFirstName: 'Test', userLastName: 'User', companyId: 2, companyName: 'Test Company',
        avatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg'
      },
    PostText: postText,
    Tags: tags,
    LikeCount: likeCount,
    Replies: replies,
    HasMoreReplies: hasMoreReplies,
    Time: '3 days ago',
    IsInternalOnly: isInternalOnly
  };
}
