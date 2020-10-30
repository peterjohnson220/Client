import { BulkExportSchedule } from 'libs/models';
import { TemplateListItem } from 'libs/features/job-description-management';

export interface ViewListGridItem {
    ViewName: string;
    Templates: TemplateListItem[];
    ExportSchedules: BulkExportSchedule[];
  }
