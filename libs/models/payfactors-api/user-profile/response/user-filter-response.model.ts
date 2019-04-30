import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

export interface UserFilterResponse {
  Id: number;
  UserId: number;
  Name: string;
  CompositeFilter: CompositeFilterDescriptor;
}
