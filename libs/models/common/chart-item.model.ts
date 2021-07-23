export interface ChartItem {
  Category: string;
  Value: number;
  Count: number;
}

export function generateMockChartItem(): ChartItem {
  return {
    Category: 'Category',
    Value: .25,
    Count: 10
  };
}
