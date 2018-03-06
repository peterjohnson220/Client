export interface FilterAggregateMetaData {
  Id: string;
  PeerFilter: number;
  FilterProp: string;
  Label: string;
  Placeholder: string;
}

export function generateMockFilterAggregateMetaData(peerFilter = 1): FilterAggregateMetaData {
  return {
    Id: 'MockId',
    PeerFilter: peerFilter,
    FilterProp: 'MockProp',
    Label: 'MockLabel',
    Placeholder: 'MockPlaceholder'
  };
}
