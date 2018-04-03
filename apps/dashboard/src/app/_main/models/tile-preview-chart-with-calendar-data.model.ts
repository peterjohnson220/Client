export interface TilePreviewChartWithCalendarData {
  TileLeftPart: TilePreviewChartWithCalendarPart;
  TileMiddlePart: TilePreviewChartWithCalendarPart;
  TileRightPart: TilePreviewChartWithCalendarPart;
}

export interface TilePreviewChartWithCalendarPart {
  CategoryName: string;
  CategoryValue: number;
  SelectedDate: Date;
  ChartData?: { Key: string, Value: number }[];
}

export function generateMockTilePreviewChartWithCalendarData(categoryName: string,
                                                             categoryValue: number = 0,
                                                             selectedDate: Date = new Date(''),
                                                             detailKey: string = '',
                                                             detailValue: number = 0): TilePreviewChartWithCalendarData {
  return {
    TileLeftPart: {
      CategoryName: categoryName, CategoryValue: categoryValue, SelectedDate: selectedDate,
      ChartData: [ { Key: detailKey, Value: detailValue } ]
    },
    TileMiddlePart: {
      CategoryName: categoryName, CategoryValue: categoryValue, SelectedDate: selectedDate,
      ChartData: [ { Key: detailKey, Value: detailValue } ]
    },
    TileRightPart: {
      CategoryName: categoryName, CategoryValue: categoryValue, SelectedDate: selectedDate,
      ChartData: [ { Key: detailKey, Value: detailValue } ]
    }
  };
}
