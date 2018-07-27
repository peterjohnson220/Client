import { CommunityPollStatusEnum } from '.';

export interface CommunityPoll {
    CommunityPollId: number;
    Question: string;
    DatePosted: Date;
    CreatedByUser: number;
    Status: CommunityPollStatusEnum;
    NumberOfResponses: number;
  }
