import { BulkExportSchedule, TemplateListItem } from 'libs/models';

export interface JobDescriptionViewListGridItem {
    ViewName: string;
    Templates: TemplateListItem[];
    ExportSchedules: BulkExportSchedule[];
  }

export function generateMockJobDescriptionViewListGridItem(mockNumber: number = 1): JobDescriptionViewListGridItem {
  return {
    ViewName: `Test View Name ${mockNumber}`,
    Templates: [],
    ExportSchedules: []
  };
}
