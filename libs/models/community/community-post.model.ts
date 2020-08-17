import { CommunityUserInfo } from './community-user-info.model';
import { CommunityTag } from './community-tag.model';
import { CommunityTopic } from './community-topic.model';
import { CommunityReply } from './community-reply.model';
import { CommunityUrlPreviewDataModel } from './community-url-preview-data.model';
import { CommunityPollRequest } from './community-poll-request.model';
import { CommunityPollResponse } from './community-poll-response.model';
import { CommunityAttachment } from './community-attachment.model';

export interface CommunityPost {
  Id: string;
  Content: string;
  UserInfo: CommunityUserInfo;
  Time: any;
  ElapsedTime: string;
  IsInternalOnly: boolean;
  LikeCount: number;
  LikedByCurrentUser: boolean;
  FavoritedByCurrentUser: boolean;
  ReplyCount: number;
  TimeTicks: number;
  Tags: CommunityTag[];
  Topic: CommunityTopic;
  Replies: CommunityReply[];
  FilteredReplies: CommunityReply[];
  ReplyIds: string[];
  HiddenReplyIds: string[];
  UrlPreviewData: CommunityUrlPreviewDataModel;
  IsCurrentUserPost: boolean;
  UserPollRequest?: CommunityPollRequest;
  UserPollResponse?: CommunityPollResponse;
  FilterTag: string;
  UserLikes: CommunityUserInfo[];
  IsDeleted: boolean;
  IsEditMode: boolean;
  Attachments: CommunityAttachment[];
}

export function generateMockCommunityPost(likeCount: number = 0, replyCount: number = 0, postText: string = '',
                                          tags: any = null, topic: any = null, isInternalOnly: boolean = false,
                                          replies: CommunityReply[] = null): CommunityPost {
  return {
    Id: 'testId',
    Content: postText,
    UserInfo:
      {
        UserId: 1, UserFirstName: 'Test', UserLastName: 'User', CompanyId: 2, CompanyName: 'Test Company', CompanyLogoSource: null,
        AvatarSource: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
        Badges: [{BadgeId: '123', BadgeText: 'Comp Collective Member'}]
      },
    Time: new Date(),
    ElapsedTime: '3 minutes ago',
    IsInternalOnly: isInternalOnly,
    LikeCount: likeCount,
    LikedByCurrentUser: false,
    FavoritedByCurrentUser: false,
    ReplyCount: replyCount,
    TimeTicks: 12345,
    Tags: tags,
    Topic: topic,
    Replies: replies,
    FilteredReplies: null,
    ReplyIds: [ '1', '2' ],
    HiddenReplyIds: [ '1' ],
    UrlPreviewData: { PreviewImageSrc: 'Test Preview Image Src',
    PreviewDescription: 'Test Preview Description', PreviewTitle: 'Test Preview Title', PreviewUrl: 'www.testUrl.com'},
    IsCurrentUserPost: false,
    UserPollRequest : { CommunityPollId: '123', Question: 'Question',
      DatePosted: new Date(), ResponseOptions: [], CreatedByUser: 1234, IsExpired: false, ExpirationDate: new Date() },
    UserPollResponse: {CommunityPollId: '123', ResponsePercents: [], ResponseVotes: [], UserHasVoted: false},
    FilterTag: '#TestTag',
    UserLikes: [],
    IsDeleted: false,
    IsEditMode: false,
    Attachments: []
  };
}
