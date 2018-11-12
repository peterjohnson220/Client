import { JobResult } from '../models';

export function toggleJobSelection(jobs: JobResult[], selectedJob: JobResult): void {
  const matchingJob = jobs.find(job => job.Id === selectedJob.Id);
  matchingJob.IsSelected = !matchingJob.IsSelected;
}

export function updateSelectedJobIds(selectedJobIds: number[], selectedJob: JobResult): number[] {
  const matchingJobId = selectedJobIds.find(id => id === selectedJob.Id);
  if (!!matchingJobId) {
    return selectedJobIds.filter(id => id !== matchingJobId);
  } else {
    return selectedJobIds.concat(selectedJob.Id);
  }
}
