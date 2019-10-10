import { JobDescriptionControl } from 'libs/models/jdm';

export interface ReorderControlDataDto {
  jobDescriptionControl: JobDescriptionControl;
  oldIndex: number;
  newIndex: number;
}
