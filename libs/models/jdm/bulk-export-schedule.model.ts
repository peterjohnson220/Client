export class BulkExportSchedule {
  Id: number;
  FileName: string;
  ViewId: string;
  Filter: string;
  IncludeDelimiters: boolean;
  IncludeFormatting: boolean;
  Format: string;
  FormatSeparatorType: string;
  Frequency: string;
  DayOfWeek: string;
  Occurrence: string;
  MonthlyOccurrence: string;
  CronExpression: string;
  Create_Date: Date;
  ExportCount: number;
  PrevRunDate: Date;
}

export function generateMockBulkExportSchedule(): BulkExportSchedule {
  return {
    Id: 1,
    FileName: 'Mock',
    ViewId: 'MockViewId',
    Filter: 'MockFilter',
    IncludeDelimiters: false,
    IncludeFormatting: false,
    Format: 'csv',
    FormatSeparatorType: 'pipe',
    Frequency: 'Weekly',
    DayOfWeek: '2,4,6',
    Occurrence: null,
    MonthlyOccurrence: null,
    CronExpression: null,
    Create_Date: null,
    ExportCount: 0,
    PrevRunDate: null
  };
}
