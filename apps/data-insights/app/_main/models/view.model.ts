export interface View {
  ViewId: string;
  ViewName: string;
  ContentUrl: string;
  ViewThumbnail?: string;
  IsFavorite?: boolean;
}

export function generateMockView(): View {
  return {
    ViewName: 'Some View',
    ViewId: 'viewId',
    ContentUrl: 'Workbook/ViewUrl',
    ViewThumbnail: 'thumbnail.png'
  };
}
