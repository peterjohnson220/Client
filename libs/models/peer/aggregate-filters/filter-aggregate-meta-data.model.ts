export interface FilterAggregateMetaData {
  Id: string;
  FilterType: number;
  FilterProp: string;
  Label: string;
  Placeholder: string;
}

export function generateMockFilterAggregateMetaData(): FilterAggregateMetaData {
  return {
    Id: 'MockId',
    FilterType: 1,
    FilterProp: 'MockProp',
    Label: 'MockLabel',
    Placeholder: 'MockPlaceholder'
  };
}
