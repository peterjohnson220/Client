import { FilterAggregateGroup, generateMockFilterAggregateGroup } from '../aggregate-filters';
import { ExchangeScopeItem, generateMockExchangeScopeItem } from './exchange-scope-item.model';

export interface PeerMapScopeSideBarInfo {
  Selections: any;
  FilterAggregateSelections: FilterAggregateGroup[];
  FilterAggregateGroups: FilterAggregateGroup[];
  SelectionsCount: number;
  IncludeUntaggedIncumbents: boolean;
  SelectedExchangeScope: ExchangeScopeItem;
}

export function generateMockPeerMapScopeSideBarInfo(): PeerMapScopeSideBarInfo {
  return {
    Selections: {},
    FilterAggregateSelections: [generateMockFilterAggregateGroup()],
    FilterAggregateGroups: [generateMockFilterAggregateGroup()],
    SelectionsCount: 0,
    IncludeUntaggedIncumbents: false,
    SelectedExchangeScope: generateMockExchangeScopeItem()
  };
}
