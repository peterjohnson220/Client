export interface TableauReportResponse {
  WorkbookId: string;
  WorkbookName: string;
  Thumbnail: string;
  WorkbookDescription: string;
  ContentUrl: string;
  ShowTabs: boolean;
  IconClass: string[];
  Tag: string;
  CreateDate?: Date;
  EditDate?: Date;
}
