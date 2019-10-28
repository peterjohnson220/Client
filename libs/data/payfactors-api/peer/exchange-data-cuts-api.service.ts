import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { UpsertDataCutRequest } from '../../../models';
import { PayfactorsApiService } from '../payfactors-api.service';
import { DataCutValidationInfo, ExchangeDataCutsExportRequest, ExchangeDataSearchFilter } from '../../../models/peer';
import {BaseExchangeDataSearchRequest} from '../../../models/payfactors-api/peer/exchange-data-search/request';

@Injectable()
export class ExchangeDataCutsApiService {
  private endpoint = 'ExchangeDataCuts';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  upsertDataCut(upsertDataCutRequest: UpsertDataCutRequest<ExchangeDataSearchFilter>): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}/UpsertDataCut`, upsertDataCutRequest);
  }
  upsertDataCutNew(upsertDataCutRequest: UpsertDataCutRequest<BaseExchangeDataSearchRequest>): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}/UpsertDataCutNew`, upsertDataCutRequest);
  }


  getDataCutValidationInfo(payload: any): Observable<DataCutValidationInfo[]> {
    return this.payfactorsApiService.get<DataCutValidationInfo[]>(`${this.endpoint}/GetDataCutValidationInfo`,
      { params: { companyJobId: payload.CompanyJobId, userSessionId: payload.UserSessionId } });
  }

  exportExchangeDataCuts(payload: ExchangeDataCutsExportRequest): Observable<any> {
    return this.payfactorsApiService.downloadFile(`${this.endpoint}/ExportExchangeDataCuts`, payload);
  }

  validateCutEmployeeSimilarity(searchFilter: ExchangeDataSearchFilter,
    companyJobId: number,
    userSessionId: number,
    dataCutGuid: string): Observable<boolean> {
    return this.payfactorsApiService.post(`${this.endpoint}/ValidateCutEmployeeSimilarity`,
      {
        CompanyJobId: companyJobId, UserSessionId: userSessionId,
        CurrentFilters: searchFilter, DataCutGuid: dataCutGuid
      }, (success: boolean) => success);
  }

}
