export interface FilterAggregateItem {
  Item: string;
  Count?: number;
}

export function generateMockFilterAggregateItem(item = 'MockItem'): FilterAggregateItem {
  return {
    Item: item,
    Count: 1
  };
}
