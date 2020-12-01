import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  UpsertDataCutRequest,
  DataCutValidationInfo,
  ExchangeDataCutsExportRequest,
  GenericKeyValue
} from 'libs/models';
import { BaseExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { TempExchangeJobDataCutRequest, TempExchangeJobDataCutResponse } from 'libs/models/payfactors-api/peer/exchange-data-cuts';
import { UpsertPeerDataCutEntityConfigurationModel } from 'libs/features/upsert-peer-data-cut/models';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class ExchangeDataCutsApiService {
  private endpoint = 'ExchangeDataCuts';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  upsertDataCutNew(upsertDataCutRequest: UpsertDataCutRequest): Observable<GenericKeyValue<number, boolean>> {
    return this.payfactorsApiService.post<GenericKeyValue<number, boolean>>(`${this.endpoint}/UpsertDataCutNew`, upsertDataCutRequest);
  }

  getTempExchangeJobDataCut(tempExchangeJobDataCutRequest: TempExchangeJobDataCutRequest): Observable<TempExchangeJobDataCutResponse> {
    return this.payfactorsApiService.post<TempExchangeJobDataCutResponse>(`${this.endpoint}/GetTempExchangeJobDataCut`, tempExchangeJobDataCutRequest);
  }

  getDataCutValidationInfo(payload: any): Observable<DataCutValidationInfo[]> {
    return this.payfactorsApiService.post<DataCutValidationInfo[]>(`${this.endpoint}/GetDataCutValidationInfo`,
      { CompanyJobId: payload.CompanyJobId, EntityConfiguration: payload.EntityConfiguration } );
  }

  exportExchangeDataCutsNew(payload: ExchangeDataCutsExportRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/ExportExchangeDataCutsNew`, payload);
  }

  validateCutEmployeeSimilarityNew(searchFilter: BaseExchangeDataSearchRequest,
                                companyJobId: number,
                                entityConfiguration: UpsertPeerDataCutEntityConfigurationModel,
                                dataCutGuid: string): Observable<boolean> {
    return this.payfactorsApiService.post(`${this.endpoint}/ValidateCutEmployeeSimilarityNew`,
      {
        CompanyJobId: companyJobId, EntityConfiguration: entityConfiguration,
        CurrentFilters: searchFilter, DataCutGuid: dataCutGuid
      }, (success: boolean) => success);
  }
  getDataCutFilter(filterGuid: string) {
    return this.payfactorsApiService.get(`${this.endpoint}/GetDataCutFilter`, {params: {filterGuid: filterGuid}});
  }
}
