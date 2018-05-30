import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

export interface UserFilter {
  Id: string;
  Name: string;
  CompositeFilter: CompositeFilterDescriptor;
}
