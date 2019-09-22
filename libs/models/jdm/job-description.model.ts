import { JobDescriptionSection } from './job-description-section.model';
import { JobInformationField } from './job-information-field.model';

export class JobDescription {
  JobDescriptionId: number;
  CompanyId: number;
  JobDescriptionRevision: number;
  Name: string;
  Sections: JobDescriptionSection[];
  DraftNumber: number;
  JobDescriptionStatus: string;
  JobInformationFields: JobInformationField[];
  TemplateId: number;
  AppliesToField: string;
  AppliesToValue: string;
  JobDescriptionTitle: string;
  CompanyJobId: number;
  CompanyLogo: string;
  CreatedDate: string;
  CreatedBy: string;
}
