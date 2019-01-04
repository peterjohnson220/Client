import { GenericNameValueDto } from '../../../common';

export interface CompanySettingsSaveRequest {
  CompanyId: number;
  Settings: GenericNameValueDto[];
}
