export interface View {
  ViewId: string;
  ViewName: string;
  ContentUrl: string;
  ViewThumbnail?: string;
  IsFavorite?: boolean;
  ViewsOrder?: number;
  FavoritesOrder?: number;
  WorkbookId: string;
}

export function generateMockView(): View {
  return {
    ViewName: 'Some View',
    ViewId: 'viewId',
    ContentUrl: 'Workbook/ViewUrl',
    ViewThumbnail: 'thumbnail.png',
    WorkbookId: 'workbookId'
  };
}
