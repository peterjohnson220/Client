import { CompositeFilterUppercase } from '../../../jdm/composite-filter-uppercase.model';

export interface GetUserFilterListResponse {
  Id: string;
  UserId: number;
  Name: string;
  CompositeFilter: CompositeFilterUppercase;
}
