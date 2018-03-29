export interface AggregateSelectionInfo {
  AggregateGroup: string;
  AggregateItem: string;
}

export function generateMockAggregateSelectionInfo(): AggregateSelectionInfo {
  return {
    AggregateGroup: 'MockProp',
    AggregateItem: 'MockItem'
  };
}
