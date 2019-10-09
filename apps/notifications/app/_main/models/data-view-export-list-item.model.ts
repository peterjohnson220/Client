export interface DataViewExportListItem {
  UserDataViewId: number;
  EventId: number;
  FileName: string;
  DownloadDate: Date;
}

export function generateMockDataViewExportHistoryListItem(): DataViewExportListItem {
  return {
    UserDataViewId: 1,
    EventId: 123,
    FileName: 'Testing File',
    DownloadDate: new Date('01/01/2000')
  };
}
