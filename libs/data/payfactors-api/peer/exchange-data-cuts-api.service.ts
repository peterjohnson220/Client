import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  UpsertDataCutRequest,
  DataCutValidationInfo,
  ExchangeDataCutsExportRequest,
  ExchangeDataSearchFilter,
  GenericKeyValue
} from 'libs/models';
import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class ExchangeDataCutsApiService {
  private endpoint = 'ExchangeDataCuts';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  upsertDataCut(upsertDataCutRequest: UpsertDataCutRequest<ExchangeDataSearchFilter>): Observable<number> {
    return this.payfactorsApiService.post<number>(`${this.endpoint}/UpsertDataCut`, upsertDataCutRequest);
  }
  upsertDataCutNew(upsertDataCutRequest: UpsertDataCutRequest<BaseExchangeDataSearchRequest>): Observable<GenericKeyValue<number, boolean>> {
    return this.payfactorsApiService.post<GenericKeyValue<number, boolean>>(`${this.endpoint}/UpsertDataCutNew`, upsertDataCutRequest);
  }


  getDataCutValidationInfo(payload: any): Observable<DataCutValidationInfo[]> {
    return this.payfactorsApiService.get<DataCutValidationInfo[]>(`${this.endpoint}/GetDataCutValidationInfo`,
      { params: { companyJobId: payload.CompanyJobId, userSessionId: payload.UserSessionId } });
  }

  exportExchangeDataCuts(payload: ExchangeDataCutsExportRequest<ExchangeDataSearchFilter>): Observable<any> {
    return this.payfactorsApiService.downloadFile(`${this.endpoint}/ExportExchangeDataCuts`, payload);
  }

  exportExchangeDataCutsNew(payload: ExchangeDataCutsExportRequest<BaseExchangeDataSearchRequest>): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/ExportExchangeDataCutsNew`, payload);
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
  validateCutEmployeeSimilarityNew(searchFilter: BaseExchangeDataSearchRequest,
                                companyJobId: number,
                                userSessionId: number,
                                dataCutGuid: string): Observable<boolean> {
    return this.payfactorsApiService.post(`${this.endpoint}/ValidateCutEmployeeSimilarityNew`,
      {
        CompanyJobId: companyJobId, UserSessionId: userSessionId,
        CurrentFilters: searchFilter, DataCutGuid: dataCutGuid
      }, (success: boolean) => success);
  }
}
