import { GetCrowdSourcedJobPricingResponse } from './get-crowd-sourced-job-pricing-response.model';

export interface SearchCrowdSourcedJobsResponse {
  Total: number;
  Jobs: GetCrowdSourcedJobPricingResponse[];
}
