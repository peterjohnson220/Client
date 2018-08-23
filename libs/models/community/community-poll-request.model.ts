import { CommunityPollResponseOption } from './community-poll-response-option.model';

export interface CommunityPollRequest {
    CommunityPollId: string;
    Question: string;
    DatePosted: Date;
    ResponseOptions: CommunityPollResponseOption[];
    CreatedByUser: number;
  }
