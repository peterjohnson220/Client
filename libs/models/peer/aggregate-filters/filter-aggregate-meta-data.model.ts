export interface FilterAggregateMetaData {
  Id: string;
  FilterType: number;
  FilterProp: string;
  Label: string;
  Placeholder: string;
}

export function generateMockFilterAggregateMetaData(filterType = 1): FilterAggregateMetaData {
  return {
    Id: 'MockId',
    FilterType: filterType,
    FilterProp: 'MockProp',
    Label: 'MockLabel',
    Placeholder: 'MockPlaceholder'
  };
}
