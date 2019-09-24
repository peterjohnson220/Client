import { JobDescriptionControl } from 'libs/models/jdm';
import { ControlTypeAttribute } from 'libs/models/common';

export interface AddSourceControlDataRowDto {
  jobDescriptionControl: JobDescriptionControl;
  attributes: ControlTypeAttribute[];
  data: any;
}
