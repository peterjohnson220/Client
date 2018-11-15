import { PeerFilterEnum } from './peer-filter.enum';

export interface FilterAggregateMetaData {
  Id: string;
  PeerFilter: PeerFilterEnum;
  FilterProp: string;
  Label: string;
  Placeholder: string;
  IncludeInFilterSideBar: boolean;
}

export function generateMockFilterAggregateMetaData(peerFilter = 1): FilterAggregateMetaData {
  return {
    Id: 'MockId',
    PeerFilter: peerFilter,
    FilterProp: 'MockProp',
    Label: 'MockLabel',
    Placeholder: 'MockPlaceholder',
    IncludeInFilterSideBar: true
  };
}
