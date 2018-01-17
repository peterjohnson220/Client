export interface TilePreviewChart {
  CategoryName: string;
  CategoryValue: number;
  DetailData?: { Key: string, Value: number }[];

}

export function generateMockTilePreviewChart(categoryName: string,
                                             categoryValue: number = 0,
                                             detailKey: string = '',
                                             detailValue: number = 0): TilePreviewChart {
  return {
    CategoryName: categoryName,
    CategoryValue: categoryValue,
    DetailData: [ { Key: detailKey, Value: detailValue } ]
  };
}
