import {JobDescriptionControl} from './job-description-control.model';

export class JobDescriptionSection {
  Id: number;
  Name: string;
  SubHeading: string;
  Controls: JobDescriptionControl[];
  Statuses: string[];
}
