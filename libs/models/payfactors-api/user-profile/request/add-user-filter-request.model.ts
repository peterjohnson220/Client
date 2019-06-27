import { CompositeFilterUppercase } from '../../../jdm';

export interface AddUserFilterRequest {
  Id: string;
  Name: string;
  CompositeFilter: CompositeFilterUppercase;
}
