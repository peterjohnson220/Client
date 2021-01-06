import { BulkExportSchedule, generateMockBulkExportSchedule } from './bulk-export-schedule.model';
import { generateMockTemplateListItem, TemplateListItem } from './template-list-item.model';

export interface JobDescriptionViewListGridItem {
    ViewName: string;
    Templates: TemplateListItem[];
    ExportSchedules: BulkExportSchedule[];
  }

export function generateMockJobDescriptionViewListGridItem(mockNumber: number = 1): JobDescriptionViewListGridItem {
  return {
    ViewName: `Test View Name ${mockNumber}`,
    Templates: [generateMockTemplateListItem()],
    ExportSchedules: [generateMockBulkExportSchedule(), generateMockBulkExportSchedule('One-time'), generateMockBulkExportSchedule('Monthly')]
  };
}
