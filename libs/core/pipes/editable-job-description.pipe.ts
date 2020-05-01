import { Pipe, PipeTransform } from '@angular/core';
import { JobDescriptionSummary } from 'libs/models';


export const MULTIPLE_JOB_DESCRIPTIONS =
  'There is more than one Job Description for this job. Please refer to the Job Description Management Tile to view each description.';

@Pipe({
  name: 'editableJobDescription'
})
export class EditableJobDescriptionPipe implements PipeTransform {
  constructor() { }
  transform(jobDescriptionSummary: JobDescriptionSummary, isJdmEnabled: boolean = true): boolean {
    if (!jobDescriptionSummary) {
      return !isJdmEnabled;
    } else if (jobDescriptionSummary.JobDescriptionManagementEnabled) {
      return false;
    } else if (!jobDescriptionSummary.JobSummary) {
      return true;
    } else if (jobDescriptionSummary.JobSummary.startsWith(MULTIPLE_JOB_DESCRIPTIONS)) {
      return false;
    } else {
      return true;
    }
  }
}
