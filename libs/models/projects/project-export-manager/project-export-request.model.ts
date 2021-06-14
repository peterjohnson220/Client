import { ReportType } from './report-type.enum';
import { PageViewIds } from 'apps/project/app/shared/constants';

export interface ProjectExportRequest {
  ProjectId: number;
  ProjectTemplateId: number;
  DataSources: string[];
  ProjectJobIds: number[];
  FileType: ReportType;
  PageViewId: PageViewIds;
}
