export interface DataViewExport {
  UserDataViewId: number;
  EventId: string;
  ReportName: string;
  FileName: string;
  ExportUrl: string;
  DownloadDate: Date;
}

export function generateMockDataViewExport(): DataViewExport {
  return {
    UserDataViewId: 1,
    EventId: 'abc-defg',
    ReportName: 'Jobs Report',
    FileName: 'Testing File',
    ExportUrl: 'TestUrl.com',
    DownloadDate: new Date('01/01/2000')
  };
}
