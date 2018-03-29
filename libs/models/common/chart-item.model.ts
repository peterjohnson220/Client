export interface ChartItem {
  Category: string;
  Value: number;
}

export function generateMockChartItem(): ChartItem {
  return {
    Category: 'Category',
    Value: .25
  };
}
