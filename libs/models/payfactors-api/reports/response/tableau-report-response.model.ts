import { TableauReportViewsResponse } from './tableau-report-views-response.model';

export interface TableauReportResponse {
  ReportType: string;
  WorkbookId: string;
  WorkbookName: string;
  Thumbnail?: string;
  WorkbookDescription: string;
  ContentUrl: string;
  CreateDate: Date;
  EditDate: Date;
  ShowTabs: boolean;
  IconClass?: string[];
  Tag: string;
  IsFavorite: boolean;
  DashboardsOrder?: number;
  FavoritesOrder?: number;
  Views?: TableauReportViewsResponse[];
}
