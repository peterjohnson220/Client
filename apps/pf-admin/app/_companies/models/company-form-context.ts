import { CompanyClientTypesReponse, SystemUserGroupsResponse, CompanyIndustriesResponse } from 'libs/models/payfactors-api';
import { UserResponse } from 'libs/models/payfactors-api/user/response';

export interface CompanyFormContext {
  clientTypes: CompanyClientTypesReponse[];
  systemUserGroups: SystemUserGroupsResponse[];
  pfAccountExecutives: UserResponse[];
  pfServicesReps: UserResponse[];
  pfJdmSrAssociates: UserResponse[];
  pfCustomerSuccessMgrs: UserResponse[];
  industries: CompanyIndustriesResponse[];
}
