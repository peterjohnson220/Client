import { CommunityJob } from 'libs/models/community/community-job.model';
import { PagingResponse } from './paging-response.model';

export interface CommunityJobSearchResponse {
  CommunityJobResults: CommunityJob[];
  Paging: PagingResponse;
}
