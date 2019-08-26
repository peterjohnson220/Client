export interface View {
  ViewId: string;
  ViewName: string;
  ContentUrl: string;
  ViewThumbnail?: string;
}

export function generateMockView(): View {
  return {
    ViewName: 'Some View',
    ViewId: 'viewId',
    ContentUrl: 'Workbook/ViewUrl',
    ViewThumbnail: 'thumbnail.png'
  };
}
