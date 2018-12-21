import { Injectable } from '@angular/core';

import {Observable} from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { UserRoleDto } from '../../../models/admin';
import {CompanyRolePermission, UserAndRoleModel} from '../../../models/security';

@Injectable()
export class CompanyRolesApiService {
  private endpoint = 'CompanyRoles';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getCompanyRoles(): Observable<UserRoleDto[]> {
    return this.payfactorsApiService.get<UserRoleDto[]>(`${this.endpoint}/GetRoles`);
  }

  addCompanyRole(companyRole: UserRoleDto): Observable<UserRoleDto> {
    return this.payfactorsApiService.post<UserRoleDto>(`${this.endpoint}`, companyRole);
  }

  getCompanyRolePermissions(roleId: number) {
    return this.payfactorsApiService.get<CompanyRolePermission[]>(`${this.endpoint}/GetCompanyRolePermissions`,
      { params: { roleId: roleId }});
  }
  updateCompanyRolePermissions(roleId: number, systemPermissionIds: number[]) {
    return this.payfactorsApiService.post<UserRoleDto>(`${this.endpoint}.UpdateCompanyRolePermissions`,
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
