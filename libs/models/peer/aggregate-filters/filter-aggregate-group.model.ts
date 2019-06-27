import { FilterAggregateItem, generateMockFilterAggregateItem } from './filter-aggregate-item.model';
import { FilterAggregateMetaData, generateMockFilterAggregateMetaData } from './filter-aggregate-meta-data.model';

export interface FilterAggregateGroup {
  MetaData: FilterAggregateMetaData;
  Aggregates: FilterAggregateItem[];
  AggregatesPreview: FilterAggregateItem[];
  IsSearching: boolean;
}

export function generateMockFilterAggregateGroup(filterType = 1): FilterAggregateGroup {
  return {
    MetaData: generateMockFilterAggregateMetaData(filterType),
    Aggregates: [generateMockFilterAggregateItem()],
    AggregatesPreview: [generateMockFilterAggregateItem()],
    IsSearching: false
  };
}
