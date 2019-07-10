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
  DashboardsOrder?: number;
  FavoritesOrder?: number;
}

export function generateMockWorkbook(): Workbook {
  return {
    WorkbookId: '123456789',
    WorkbookName: 'abc',
    Thumbnail: '',
    WorkbookDescription: 'Report',
    ContentUrl: 'content url',
    ShowTabs: true,
    IconClass: [],
    Tag: '',
    IsFavorite: false,
    DefaultTag: '',
    DashboardsOrder: 1,
    FavoritesOrder: 2
  };
}
