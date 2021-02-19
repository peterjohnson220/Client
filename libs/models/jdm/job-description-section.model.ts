import {JobDescriptionControl} from './job-description-control.model';

export class JobDescriptionSection {
  Id: number;
  Name: string;
  SubHeading: string;
  ShowSubheading: boolean;
  Controls: JobDescriptionControl[];
  Statuses: string[];
}

export function showSection(section: JobDescriptionSection): boolean {
  return section.Controls.length > 0 ? section.Controls.some( x => x.AdditionalProperties?.ShowControl !== false) : true;
}
