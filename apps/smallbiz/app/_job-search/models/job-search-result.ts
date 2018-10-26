import { Job } from './job';

export interface JobSearchResult {
  jobs: Job[];
  totalMatches: number;
}
