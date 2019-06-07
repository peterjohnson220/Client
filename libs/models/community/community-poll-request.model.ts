import { CommunityPollResponseOption, generateMockCommunityPollResponseOption } from './community-poll-response-option.model';

export interface CommunityPollRequest {
    CommunityPollId: string;
    Question: string;
    DatePosted: Date;
    ResponseOptions: CommunityPollResponseOption[];
    CreatedByUser: number;
    IsExpired: boolean;
    ExpirationDate: Date;
  }

  export function generateMockCommunityPollRequest(): CommunityPollRequest {
    return {
      CommunityPollId: '1234',
      Question: 'Who is here?',
      DatePosted: new Date(),
      ResponseOptions: [generateMockCommunityPollResponseOption(0, 'yes'), generateMockCommunityPollResponseOption(1, 'no')],
      CreatedByUser: 123,
      IsExpired: false,
      ExpirationDate: new Date()
    };
  }
