export interface FilterAggregateItem {
  Id?: number;
  Item: string;
  Count?: number;
  Selected: boolean;
}

export function generateMockFilterAggregateItem(item = 'MockItem'): FilterAggregateItem {
  return {
    Id: undefined,
    Item: item,
    Count: 1,
    Selected: false
  };
}
