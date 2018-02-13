import { FilterAggregateItem, generateMockFilterAggregateItem } from './filter-aggregate-item.model';
import { FilterAggregateMetaData, generateMockFilterAggregateMetaData } from './filter-aggregate-meta-data.model';

export interface FilterAggregateGroup {
  MetaData: FilterAggregateMetaData;
  Aggregates: FilterAggregateItem[];
}

export function generateMockFilterAggregateGroup(): FilterAggregateGroup {
  return {
    MetaData: generateMockFilterAggregateMetaData(),
    Aggregates: [generateMockFilterAggregateItem()]
  };
}
