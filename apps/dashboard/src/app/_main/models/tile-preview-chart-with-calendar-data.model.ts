export interface TilePreviewChartWithCalendarData {
  CategoryName: string;
  CategoryValue: number;
  SelectedDate: Date;
  ChartData?: { Key: string, Value: number }[];
}

export function generateMockTilePreviewChartWithCalendarData(categoryName: string,
                                                             categoryValue: number = 0,
                                                             selectedDate: Date = new Date(''),
                                                             detailKey: string = '',
                                                             detailValue: number = 0): TilePreviewChartWithCalendarData[] {
  return [ {
    CategoryName: categoryName,
    CategoryValue: categoryValue,
    SelectedDate: selectedDate,
    ChartData: [ { Key: detailKey, Value: detailValue } ]
  },
    {
      CategoryName: categoryName,
      CategoryValue: categoryValue,
      SelectedDate: selectedDate,
      ChartData: [ { Key: detailKey, Value: detailValue } ]
    },
    {
      CategoryName: categoryName,
      CategoryValue: categoryValue,
      SelectedDate: selectedDate,
      ChartData: [ { Key: detailKey, Value: detailValue } ]
    } ];
}
