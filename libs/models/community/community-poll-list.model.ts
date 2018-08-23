import { CommunityPollResponseOption } from './community-poll-response-option.model';

export interface CommunityPollList {
    CommunityPollId: string;
    Question: string;
    DatePosted: Date;
    CreatedByUser: number;
    Status: number;
    NumberOfResponses: number;
    ResponseOptions: CommunityPollResponseOption[];
  }
