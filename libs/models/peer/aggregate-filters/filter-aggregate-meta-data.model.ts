export interface FilterAggregateMetaData {
  Id: string;
  Filter: number;
  FilterProp: string;
  Label: string;
  Placeholder: string;
}

export function generateMockFilterAggregateMetaData(filter = 1): FilterAggregateMetaData {
  return {
    Id: 'MockId',
    Filter: filter,
    FilterProp: 'MockProp',
    Label: 'MockLabel',
    Placeholder: 'MockPlaceholder'
  };
}
