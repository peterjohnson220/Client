import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { BaseUrlLocation } from '../../../models/payfactors-api/common/base-url-location.enum';
import { UserContext } from '../../../models/security';
import { UserBulkAdd } from '../../../models/admin/user-bulk-add.model';

@Injectable()
export class BulkAddUsersApiService {
  private endpoint = 'BulkAddUsersLoad';
  private excelEndpoint = 'BulkAddUsersLoadExcel';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) { }

  storeFileName(fileName: string): Observable<string> {
    return this.payfactorsApiService.post<string>(`${this.endpoint}/StoreFileName`,
      {fileName: fileName}, this.payfactorsApiService.extractValueFromOdata, BaseUrlLocation.FrontEnd, true);
  }

  storeAndMapBulkAddUsersInSession(userBulkAddPayload: UserBulkAdd): Observable<string> {
    return this.payfactorsApiService.post<string>(`${this.endpoint}/MapBulkAddUsers`,
      { worksheetName: userBulkAddPayload.WorksheetName, companyId: userBulkAddPayload.CompanyId },
      this.payfactorsApiService.extractValueFromOdata, BaseUrlLocation.FrontEnd, true);
  }

  validateHeaders(userBulkAddPayload: UserBulkAdd): Observable<string> {
    return this.payfactorsApiService.post<string>(`${this.endpoint}/ValidateBulkAddUsersHeader`,
      { worksheetName: userBulkAddPayload.WorksheetName, companyId: userBulkAddPayload.CompanyId },
      this.payfactorsApiService.extractValueFromOdata, BaseUrlLocation.FrontEnd, true);
  }

  validateRequiredFields(companyId: number): Observable<string> {
    return this.payfactorsApiService.post<string>(`${this.endpoint}/ValidateBulkAddUsersRequiredFields`,
      { companyId: companyId }, this.payfactorsApiService.extractValueFromOdata, BaseUrlLocation.FrontEnd, true);
  }

  validateEmails() {
    return this.payfactorsApiService.post<string>(`${this.endpoint}/ValidateBulkAddUsersEmails`,
      {}, this.payfactorsApiService.extractValueFromOdata, BaseUrlLocation.FrontEnd, true);
  }

  validatePasswords(companyId: number) {
    return this.payfactorsApiService.post<string>(`${this.endpoint}/ValidateBulkAddUsersPasswords`,
      {companyId: companyId }, this.payfactorsApiService.extractValueFromOdata, BaseUrlLocation.FrontEnd, true);
  }

  validateUserRoles(companyId: number) {
    return this.payfactorsApiService.post<string>(`${this.endpoint}/ValidateBulkAddUsersUserRoles`,
      {companyId: companyId }, this.payfactorsApiService.extractValueFromOdata, BaseUrlLocation.FrontEnd, true);
  }

  downloadDataFileWithErrors(companyId: number, bulkAddUsersValidationErrors: any) {
    return this.payfactorsApiService.downloadFile(`${this.excelEndpoint}/DownloadDataFileWithErrors`,
      { companyId: companyId, bulkAddUsersValidationErrors: bulkAddUsersValidationErrors}, null,
      false, BaseUrlLocation.FrontEnd, true);
  }

  getImportCount() {
    return this.payfactorsApiService.get<string>(`${this.endpoint}/GetUpdatedBulkAddUsersCount`,
      {}, this.payfactorsApiService.extractValueFromOdata, BaseUrlLocation.FrontEnd, true);
  }

  saveBulkAddUsers(userBulkAddPayload: UserBulkAdd) {
    return this.payfactorsApiService.post<string>(`${this.endpoint}/SaveBulkAddUsers`,
      {companyId: userBulkAddPayload.CompanyId, worksheetName: userBulkAddPayload.WorksheetName},
      this.payfactorsApiService.extractValueFromOdata, BaseUrlLocation.FrontEnd, true);
  }



}
