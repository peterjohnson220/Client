export interface CommunityPost {
  UserInfo: CommunityUserInfo;
  PostText: string;
  Tags: CommunityTag[];
  LikeCount: number;
  Replies: CommunityReply[];
  Time: any;
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
  UserInfo: any;
  ReplyText: string;
  Time: any;
}

export function generateMockCommunityPost(likeCount: number = 0, postText: string = '', tags: any = null): CommunityPost {
  return {
    UserInfo:
      {userId: 1, userFirstName: 'Test', userLastName: 'User', companyId: 2, companyName: 'Test Company',
      avatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg'},
    PostText: postText,
    Tags: tags,
    LikeCount: likeCount,
    Replies: [{UserInfo: 'another user', ReplyText: 'test reply text', Time: '5 minutes ago'}],
    Time: '3 days ago'
  };
}
