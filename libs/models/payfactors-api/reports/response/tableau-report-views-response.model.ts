export interface TableauReportViewsResponse {
  ViewName: string;
  ContentUrl: string;
  ViewId: string;
  ViewThumbnail: string;
  IsFavorite?: boolean;
  ViewsOrder?: number;
  FavoritesOrder?: number;
  WorkbookId: string;
}
