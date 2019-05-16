import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

export interface AddUserFilterRequest {
  Name: string;
  CompositeFilter: CompositeFilterDescriptor;
}
