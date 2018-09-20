import { JobResult } from '../models';

export function hasMoreDataCuts(job: JobResult): boolean {
  return job.DataCuts.length < job.TotalDataCuts;
}
