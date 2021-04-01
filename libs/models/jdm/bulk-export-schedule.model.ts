export class BulkExportScheduleParameters {
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
  PrevRunDate: Date;
  ComplexJsonExport?: boolean;
  ReportType: string;
}

export class BulkExportSchedule extends BulkExportScheduleParameters {
  Id: number;
  ExportCount: number;
}

export function generateMockBulkExportSchedule(frequency: string = 'Weekly'): BulkExportSchedule {
  return {
    Id: 1,
    FileName: 'Mock',
    ViewId: 'MockViewId',
    Filter: 'MockFilter',
    IncludeDelimiters: false,
    IncludeFormatting: false,
    Format: 'csv',
    FormatSeparatorType: 'pipe',
    Frequency: frequency,
    DayOfWeek: '2,4,6',
    Occurrence: null,
    MonthlyOccurrence: null,
    CronExpression: null,
    Create_Date: null,
    ExportCount: 0,
    PrevRunDate: null,
    ComplexJsonExport: true,
    ReportType: null
  };
}
