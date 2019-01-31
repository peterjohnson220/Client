import { CommunityLink } from './community-link.model';

export interface CommunityPollUpsertRequest {
    CommunityPollId: string;
    Question: string;
    ResponseOptions: string[];
    Status: number;
    DurationInHours?: number;
    Links: CommunityLink[];
  }
