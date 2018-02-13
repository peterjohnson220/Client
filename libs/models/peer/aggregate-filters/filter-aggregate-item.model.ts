export interface FilterAggregateItem {
  Item: string;
  Count?: number;
}

export function generateMockFilterAggregateItem(): FilterAggregateItem {
  return {
    Item: 'MockItem',
    Count: 1
  };
}
