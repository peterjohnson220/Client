import {JobDescriptionControl} from './job-description-control.model';

export class JobDescriptionSection {
  Id: number;
  Name: string;
  SubHeading: string;
  ShowSubheading: boolean;
  Controls: JobDescriptionControl[];
  Statuses: string[];
}
