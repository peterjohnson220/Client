import { ReportType } from './report-type.enum';

export interface ProjectExportModalData {
  ProjectTemplateId: number;
  DataSources: string[];
  FileType: ReportType;
}
