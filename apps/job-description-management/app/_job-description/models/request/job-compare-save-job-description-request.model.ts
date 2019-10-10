import { JobDescription } from 'libs/models/jdm';

export interface JobCompareSaveJobDescriptionRequestModel {
  JobDescription: JobDescription;
  IsFirstSave: boolean;
  CompareJobDescriptionId: number;
}
