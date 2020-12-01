import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { UserManagementDto } from 'libs/models/payfactors-api/user';
import { UserResponse, ShareUserResponse } from 'libs/models/payfactors-api/user/response';
import { UserAssignedRole, HomePageLink } from 'libs/models';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  private endpoint = 'User';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}


  get(userId: number) {
    return this.payfactorsApiService.get<UserResponse>(`${this.endpoint}(${userId})/`);
  }

  saveUser(user: UserManagementDto) {
    return this.payfactorsApiService.post<UserManagementDto>(`${this.endpoint}/Default.SaveUser`, {User: user});
  }

  emailExists(email: string) {
      return this.payfactorsApiService.post(`${this.endpoint}/Default.EmailExists`, {emailAddress: email});
  }

  getUserHomePageAuthenticated() {
    return this.payfactorsApiService
      .get<string>(`${this.endpoint}(0)/Default.GetUserHomePageAuthenticated`);
  }

  getUserHomePage(userId: number) {
    return this.payfactorsApiService
      .get<HomePageLink>(`${this.endpoint}(${userId})/Default.GetUserHomePage`);
  }

  getUserAssignedRoles() {
    return this.payfactorsApiService
      .get<UserAssignedRole[]>(`${this.endpoint}/Default.GetAvailableAndAssignedRolesForCurrentUser`);
  }

  getEmailRecipientsSearchResults(companyId: number, searchTerm: string, loaderType: string, loaderConfigurationGroupId: number) {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/Default.GetEmailRecipientsSearchResults`,
      {
        params: {
          companyId: companyId,
          search: searchTerm,
          loaderType: loaderType,
          loaderConfigurationGroupId: loaderConfigurationGroupId
        }
      });
  }

  getPfAccountExecutives() {
    return this.payfactorsApiService
      .get<UserResponse[]>(`${this.endpoint}/Default.GetPfAccountExecutives`);
  }

  getPfServicesReps() {
    return this.payfactorsApiService
      .get<UserResponse[]>(`${this.endpoint}/Default.GetPfServicesReps`);
  }

  getPfJdmSrAssociates() {
    return this.payfactorsApiService
      .get<UserResponse[]>(`${this.endpoint}/Default.GetPfJDMSeniorAssociates`);
}

  getPfServiceRepsByCompany(companyId: number) {
    return this.payfactorsApiService
      .get<UserResponse[]>(`${this.endpoint}/Default.GetPfServicesRepsForCompany?companyId=${companyId}`);
  }

  getByCompany(companyId: number) {
    return this.payfactorsApiService
      .get<UserResponse[]>(`${this.endpoint}/Default.GetByCompany?companyId=${companyId}`);
  }

  getPfCustomerSuccessMgrs(): Observable<UserResponse[]> {
    return this.payfactorsApiService.get<UserResponse[]>(`${this.endpoint}/Default.GetPfCustomerSuccessMgrs`);
  }

  getShareableUsers(userId: number, companyId: number): Observable<ShareUserResponse[]> {
    return this.payfactorsApiService.get<ShareUserResponse[]>(`${this.endpoint}(${userId})/Default.GetShareableUsers`, {
      params: {
        companyId: companyId
      }
    });
  }

  getShareableUsersByTile(userId: number, companyId: number, tileName: string): Observable<ShareUserResponse[]> {
    return this.payfactorsApiService.get<ShareUserResponse[]>(`${this.endpoint}(${userId})/Default.GetShareableUsersByTile`, {
      params: {
        companyId: companyId,
        tileName: tileName
      }
    });
  }

  picker(searchTerm: string) {
    return this.payfactorsApiService.get(this.endpoint + '/Default.Picker', {
      params: {
        search: searchTerm
      }
    });
  }

  jobPicker(searchTerm: string, jobId: number) {
    return this.payfactorsApiService.get(this.endpoint + '/Default.JobPicker', {
      params: {
        search: searchTerm,
        jobId: jobId
      }
    });
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.ChangePassword`, {
      CurrentPassword: currentPassword,
      NewPassword: newPassword
    });

  }
}
