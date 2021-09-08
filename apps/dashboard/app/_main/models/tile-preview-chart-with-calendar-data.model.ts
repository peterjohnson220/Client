export interface TilePreviewChartWithCalendarData {
  TileLeftPart: TilePreviewChartWithCalendarPart;
  TileMiddlePart: TilePreviewChartWithCalendarPart;
  TileRightPart: TilePreviewChartWithCalendarPart;
}

export interface TilePreviewChartWithCalendarPart {
  CategoryName: string;
  CategoryValue: string;
  SelectedDate: Date;
  ShouldGetBeforeSelectedDate: boolean;
  ChartData?: { Key: string, Value: number }[];
}

export function generateMockTilePreviewChartWithCalendarData(categoryName: string,
                                                             categoryValue: string = '0',
                                                             selectedDate: Date = new Date(''),
                                                             detailKey: string = '',
                                                             detailValue: number = 0): TilePreviewChartWithCalendarData {
  return {
    TileLeftPart: {
      CategoryName: categoryName, CategoryValue: categoryValue, ShouldGetBeforeSelectedDate: false, SelectedDate: selectedDate,
      ChartData: [ { Key: detailKey, Value: detailValue } ]
    },
    TileMiddlePart: {
      CategoryName: categoryName, CategoryValue: categoryValue, ShouldGetBeforeSelectedDate: false, SelectedDate: selectedDate,
      ChartData: [ { Key: detailKey, Value: detailValue } ]
    },
    TileRightPart: {
      CategoryName: categoryName, CategoryValue: categoryValue, ShouldGetBeforeSelectedDate: false, SelectedDate: selectedDate,
      ChartData: [ { Key: detailKey, Value: detailValue } ]
    }
  };
}
