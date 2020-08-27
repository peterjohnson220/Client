import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UserAndRoleModel, UserAssignedRole, SaveRoleResponseModel, DataType, RoleDataRestriction, UserRole } from 'libs/models/security/roles';

import { PayfactorsApiService } from '../payfactors-api.service';



@Injectable({
  providedIn: 'root',
})
export class RolesApiService {
  private endpoint = 'Role';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) { }

  getRoles(): Observable<UserAssignedRole[]> {
    return this.payfactorsApiService.get<UserAssignedRole[]>(`${this.endpoint}/GetRoles`);
  }

  getRolesByCompanyId(companyId: number): Observable<UserAssignedRole[]> {
    return this.payfactorsApiService.get<UserAssignedRole[]>(`${this.endpoint}/GetRoles?companyId=${companyId}`);
  }

  getRoleforUser(userId: number): Observable<UserRole> {
    return this.payfactorsApiService.get<UserRole>(`${this.endpoint}/GetRole?userId=${userId}`);
  }

  addRole(role: UserAssignedRole): Observable<UserAssignedRole> {
    return this.payfactorsApiService.post<UserAssignedRole>(`${this.endpoint}`, role);
  }

  getUsersAndRoles() {
    return this.payfactorsApiService.get<UserAndRoleModel[]>(`${this.endpoint}.GetUsersAndRoles`);
  }

  saveRole(permissionIds: number[], userIds: number[], roleDataRestrictions: RoleDataRestriction[], roleId: number, isSystemRole: boolean) {
    return this.payfactorsApiService.post<SaveRoleResponseModel>(`${this.endpoint}(${roleId})/Default.SaveRole`,
      { permissionIds: permissionIds, userIdsToAssign: userIds, roleDataRestrictions: roleDataRestrictions, isSystemRole: isSystemRole });
  }

  updateRoleName(newRoleName: string, roleId: number) {
    return this.payfactorsApiService.post<string>(`${this.endpoint}(${roleId})/Default.UpdateRoleName`,
      { newRoleName: newRoleName });
  }

  getDataTypes() {
    return this.payfactorsApiService.get<DataType[]>(`${this.endpoint}/GetDataTypes`);
  }

  deleteRole(roleId: number) {
    return this.payfactorsApiService.post(`${this.endpoint}(${roleId})/Default.DeleteRole`);
  }
}
