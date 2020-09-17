import { BaseSearchRequest } from '../../search/request';

export interface EmployeeSearchRequest extends BaseSearchRequest {
  StatementId?: string;
}
