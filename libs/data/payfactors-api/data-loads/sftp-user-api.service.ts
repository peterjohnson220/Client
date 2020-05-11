import { Injectable } from '@angular/core';
import { PayfactorsApiService } from '../payfactors-api.service';
import { SftpUserModel } from '../../../models/Sftp';

@Injectable()
export class SftpUserApiService {
  private endpoint = 'SftpUser';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getSftpUser(companyId: number) {
    return this.payfactorsApiService.get<SftpUserModel>(`${this.endpoint}/Get`, {
      params: {companyId: companyId}
    });
  }

  validateUserName(payload: any) {
    return this.payfactorsApiService.get<boolean>(`${this.endpoint}/ValidateUserName`, {
      params: {username: payload.userName, companyId: payload.companyId}
    });
  }
}
