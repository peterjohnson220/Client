export interface FilterAggregateItem {
  Item: string;
  Count?: number;
  Selected: boolean;
}

export function generateMockFilterAggregateItem(item = 'MockItem'): FilterAggregateItem {
  return {
    Item: item,
    Count: 1,
    Selected: false
  };
}
