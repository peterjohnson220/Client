import { UserContext } from 'libs/models/security';
import { SystemUserGroupNames } from 'libs/constants';

// Small Business Client Helper
export class SmbClientHelper {
  static isSmallBuisnessClient(userContext: UserContext): boolean {
    return userContext.CompanySystemUserGroupsGroupName === SystemUserGroupNames.SmallBusiness;
  }
}
