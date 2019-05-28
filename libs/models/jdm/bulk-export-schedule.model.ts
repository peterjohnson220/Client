export class BulkExportSchedule {
  Id: number;
  FileName: string;
  ViewId: string;
  Filter: string;
  IncludeDelimiters: boolean;
  Frequency: string;
  DayOfWeek: string;
  Occurrence: string;
  MonthlyOccurrence: string;
  CronExpression: string;
  Create_Date: Date;
}

export function generateMockBulkExportSchedule(): BulkExportSchedule {
  return {
    Id: 1,
    FileName: 'Mock',
    ViewId: 'MockViewId',
    Filter: 'MockFilter',
    IncludeDelimiters: false,
    Frequency: 'Weekly',
    DayOfWeek: '2,4,6',
    Occurrence: null,
    MonthlyOccurrence: null,
    CronExpression: null,
    Create_Date: null,
  };
}
