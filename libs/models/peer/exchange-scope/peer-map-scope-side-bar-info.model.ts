import { FilterAggregateGroup, generateMockFilterAggregateGroup } from '../aggregate-filters';

export interface PeerMapScopeSideBarInfo {
  Selections: any;
  FilterAggregateSelections: FilterAggregateGroup[];
  FilterAggregateGroups: FilterAggregateGroup[];
  SelectionsCount: number;
}

export function generateMockPeerMapScopeSideBarInfo(): PeerMapScopeSideBarInfo {
  return {
    Selections: {},
    FilterAggregateSelections: [generateMockFilterAggregateGroup()],
    FilterAggregateGroups: [generateMockFilterAggregateGroup()],
    SelectionsCount: 0
  };
}
