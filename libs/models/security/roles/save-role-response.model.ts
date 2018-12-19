import {UserAssignedRole, UserAndRoleModel} from '../../../models/security/roles';

export class SaveRoleResponseModel {
  UpdatedRole: UserAssignedRole;
  UpdatedRoleList: UserAssignedRole[];
  UpdatedUsers: UserAndRoleModel[];
}
