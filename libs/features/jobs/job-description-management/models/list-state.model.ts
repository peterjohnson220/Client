import { CompositeFilterDescriptor, GroupDescriptor, SortDescriptor } from '@progress/kendo-data-query';

export interface ListState {
  Filter: CompositeFilterDescriptor;
  Group: GroupDescriptor[];
  Skip: number;
  Sort: SortDescriptor[];
  Take: number;
}
