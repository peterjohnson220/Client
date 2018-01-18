export interface TilePreviewChartData {
  CategoryName: string;
  CategoryValue: number;
  DetailData?: { Key: string, Value: number }[];
}
export function generateMockTilePreviewChartData(categoryName: string,
                                             categoryValue: number = 0,
                                             detailKey: string = '',
                                             detailValue: number = 0): TilePreviewChartData {
    return {
      CategoryName: categoryName,
      CategoryValue: categoryValue,
      DetailData: [ { Key: detailKey, Value: detailValue } ]
    };
}
