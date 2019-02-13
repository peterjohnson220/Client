import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UpsertDataCutRequest } from '../../../models';
import { PayfactorsApiService } from '../payfactors-api.service';
import { DataCutValidationInfo, ExchangeDataCutsExportRequest, ExchangeDataSearchFilter } from '../../../models/peer';

@Injectable()
export class ExchangeDataCutsApiService {
  private endpoint = 'ExchangeDataCuts';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  upsertDataCut(upsertDataCutRequest: UpsertDataCutRequest): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}/UpsertDataCut`, upsertDataCutRequest);
  }

  getDataCutValidationInfo(payload: any): Observable<DataCutValidationInfo[]> {
    return this.payfactorsApiService.get<DataCutValidationInfo[]>(`${this.endpoint}/GetDataCutValidationInfo`,
      { params: { companyJobId: payload.CompanyJobId, userSessionId: payload.UserSessionId } });
  }

  exportExchangeDataCuts(payload: ExchangeDataCutsExportRequest): Observable<any> {
    return this.payfactorsApiService.downloadFile(`${this.endpoint}/ExportExchangeDataCuts`, payload);
  }

  validateCutEmployeeSimilarity(searchFilter: ExchangeDataSearchFilter, companyJobId: number, userSessionId: number): Observable<boolean> {
    return this.payfactorsApiService.post(`${this.endpoint}/ValidateCutEmployeeSimilarity`,
      { companyJobId, userSessionId, currentFilters: searchFilter }, (success: boolean) => success);
  }

}
