import { JobDescriptionControl } from 'libs/models/jdm';

export interface AppendToControlDataAttributeValueDto {
  jobDescriptionControl: JobDescriptionControl;
  dataRow: any;
  attribute: any;
  value: any;
}
