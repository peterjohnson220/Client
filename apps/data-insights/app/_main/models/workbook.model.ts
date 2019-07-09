export interface Workbook {
  WorkbookId: string;
  WorkbookName: string;
  Thumbnail: string;
  WorkbookDescription: string;
  ContentUrl: string;
  ShowTabs: boolean;
  IconClass: string[];
  Tag: string;
  IsFavorite: boolean;
  DefaultTag: string;
}
