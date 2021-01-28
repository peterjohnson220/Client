import { JobResult } from '../models';

export function toggleJobSelection(jobs: JobResult[], selectedJob: JobResult): void {
  const matchingJob = jobs.find(job => job.Id === selectedJob.Id);
  matchingJob.IsSelected = !matchingJob.IsSelected;
}

export function updateSelectedJobIds(selectedJobIds: string[], selectedJob: JobResult): string[] {
  return toggleValueInList(selectedJobIds, selectedJob.Id);
}

export function updateSelectedJobCodes(selectedJobCodes: string[], selectedJob: JobResult): string[] {
  return toggleValueInList(selectedJobCodes, selectedJob.Code);
}

function toggleValueInList(valuesList: string[], value: string) {
  const matchingValue = valuesList.find(id => id === value);
  if (!!matchingValue) {
    return valuesList.filter(id => id !== matchingValue);
  } else {
    return valuesList.concat(value);
  }
}
