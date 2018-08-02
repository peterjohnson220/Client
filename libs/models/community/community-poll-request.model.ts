import { CommunityPollResponseOption } from './community-poll-response-option.model';

export interface CommunityPollRequest {
    CommunityPollId: number;
    Question: string;
    DatePosted: Date;
    ResponseOptions: CommunityPollResponseOption[];
    CreatedByUser: number;
  }
