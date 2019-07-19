import { TemplateSection } from './template-section.model';
import { JobInformationField } from '../../shared/models/job-information-field.model';

export class Template {
    TemplateId: number;
    CompanyId: number;
    TemplateRevision: number;
    TemplateName: string;
    TemplateStatus: string;
    Sections: TemplateSection[];
    DraftNumber: number;
    JobInformationFields: JobInformationField[];
    CompanyLogo: string;
}
