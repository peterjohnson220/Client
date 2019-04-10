import { Injectable } from '@angular/core';

import {Observable} from 'rxjs';

import { UserAndRoleModel, UserAssignedRole, SaveRoleResponseModel } from 'libs/models/security/roles';
import {DataType} from 'libs/models/security/roles/data-type';

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

  getUsersAndRoles() {
    return this.payfactorsApiService.get<UserAndRoleModel[]>(`${this.endpoint}.GetUsersAndRoles`);
  }

  saveRole(permissionIds: number[], userIds: number[], roleId: number, isSystemRole: boolean) {
    return this.payfactorsApiService.post<SaveRoleResponseModel>(`${this.endpoint}(${roleId})/Default.SaveRole`,
      {permissionIds: permissionIds, userIdsToAssign: userIds, isSystemRole: isSystemRole});
  }

  getDataTypes() {
    return this.payfactorsApiService.get<DataType[]>(`${this.endpoint}/GetDataTypes`);
  }
}
