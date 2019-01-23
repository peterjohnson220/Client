import { Injectable } from '@angular/core';

import {Observable} from 'rxjs';

import { RolePermission, UserAndRoleModel, UserAssignedRole } from 'libs/models/security';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class RolesApiService {
  private endpoint = 'Role';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getRoles(): Observable<UserAssignedRole[]> {
    return this.payfactorsApiService.get<UserAssignedRole[]>(`${this.endpoint}/GetRoles`);
  }

  addRole(role: UserAssignedRole): Observable<UserAssignedRole> {
    return this.payfactorsApiService.post<UserAssignedRole>(`${this.endpoint}`, role);
  }

  getRolePermissions(roleId: number) {
    return this.payfactorsApiService.get<RolePermission[]>(`${this.endpoint}/GetCompanyRolePermissions`,
      { params: { roleId: roleId }});
  }
  updateRolePermissions(roleId: number, systemPermissionIds: number[]) {
    return this.payfactorsApiService.post<UserAssignedRole>(`${this.endpoint}.UpdateCompanyRolePermissions`,
      {roleId: roleId, permissionIds: systemPermissionIds});
  }

  getUsersAndRoles() {
    return this.payfactorsApiService.get<UserAndRoleModel[]>(`${this.endpoint}.GetUsersAndRoles`);
  }

  assignUsersToRole(userIds: number[], roleId: number, isSystemRole: boolean) {
    return this.payfactorsApiService.post<UserAndRoleModel[]>(`${this.endpoint}(${roleId})/Default.AssignUsersToRole`,
      {userIds: userIds, isSystemRole: isSystemRole});
  }
}
