export interface ToggleAggregateGroupSelections {
  ShouldSelect: boolean;
  FilterProp: string;
}

export function generateMockToggleAggregateGroupSelections(): ToggleAggregateGroupSelections {
  return {
    ShouldSelect: true,
    FilterProp: 'MockProp'
  };
}
