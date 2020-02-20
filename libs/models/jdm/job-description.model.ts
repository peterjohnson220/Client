import { JobDescriptionSection } from './job-description-section.model';
import { JobInformationField } from './job-information-field.model';

export class JobDescription {
  AppliesToField: string;
  AppliesToValue: string;
  CompanyId: number;
  CompanyJobId: number;
  CompanyLogo: string;
  CreatedBy: string;
  CreatedDate: string;
  DraftNumber: number;
  JobDescriptionId: number;
  JobDescriptionRevision: number;
  JobDescriptionStatus: string;
  JobDescriptionTitle: string;
  JobInformationFields: JobInformationField[];
  Name: string;
  PublicView: boolean;
  Sections: JobDescriptionSection[];
  TemplateId: number;
}
