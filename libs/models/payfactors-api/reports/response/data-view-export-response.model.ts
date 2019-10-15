export interface DataViewExportResponse {
  ExportId: number;
  UserId: number;
  EventId: string;
  UserDataViewId: number;
  ReportName: string;
  FileName: string;
  Completed: boolean;
  Failed?: boolean;
  CreateDate: Date;
  CreateUser: number;
  EditDate: Date;
  EditUser: number;
  ExportUrl: string;
}
