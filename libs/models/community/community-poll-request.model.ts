export interface CommunityPollRequest {
    Question: string;
    DatePosted: Date;
    ResponseOptions: string[];
    CreatedByUser: number;
  }
