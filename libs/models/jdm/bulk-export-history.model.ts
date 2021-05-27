export class BulkExportHistory {
  FileName: string;
  CompanyId: number;
  IsSuccessful: boolean;
  EndTime: Date;
  StartTime: Date;
  ErrorMessage: string;
  MethodType: string;
  ScheduleId: string;
}

export function generateMockBulkExportHistory(): BulkExportHistory {
  return {
    FileName: 'Mock',
    CompanyId: 123,
    EndTime: new Date('01-01-1901'),
    StartTime: new Date('01-01-1901'),
    ErrorMessage: 'Mock Error Message',
    IsSuccessful: true,
    MethodType: 'MockMethodType',
    ScheduleId: '123abc'
  };
}
