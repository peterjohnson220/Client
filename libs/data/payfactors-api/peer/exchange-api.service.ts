import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { MappingHelper } from '../../../core/helpers';
import { ExchangeListItem, Exchange, ExchangeCompany, UpsertExchangeRequest, AddExchangeCompaniesRequest, ExchangeJob,
         ValidateExchangeJobsRequest, ImportExchangeJobsRequest,
         ExchangeJobsValidationResultModel, AddExchangeJobsRequest } from '../../../models/peer';
import { PayfactorsApiService } from '../payfactors-api.service';


@Injectable()
export class ExchangeApiService {
  private endpoint = 'Exchange';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  addCompanies(addExchangeCompaniesRequest: AddExchangeCompaniesRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/AddCompanies`, addExchangeCompaniesRequest);
  }

  getAllExchanges(): Observable<ExchangeListItem[]> {
    return this.payfactorsApiService.get<ExchangeListItem[]>(`${this.endpoint}/GetAllExchanges`);
  }

  getAvailableCompanies(exchangeId: number, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetAvailableCompanies`, {
        params: {exchangeId: exchangeId, listState: JSON.stringify(listState)}
      },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  getCompanies(exchangeId: number, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetCompanies`, {
        params: {exchangeId: exchangeId, listState: JSON.stringify(listState)}
      },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  getCompaniesWithPeerEnabled(includeDetails: boolean): Observable<any[]> {
    return this.payfactorsApiService.get<any[]>(`${this.endpoint}/GetCompaniesWithPeerEnabled`, {
      params: {includeDetails: includeDetails}
    });
  }

  getAvailableJobs(exchangeId: number, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetAvailableJobs`, {
        params: {exchangeId: exchangeId, listState: JSON.stringify(listState)}
      },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  addJobs(addExchangeJobsRequest: AddExchangeJobsRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/AddJobs`, addExchangeJobsRequest);
  }

  getExchange(exchangeId: number): Observable<Exchange> {
    return this.payfactorsApiService.get<Exchange>(`${this.endpoint}/GetExchange`, { params: { exchangeId: exchangeId } });
  }

  getExchangeJobs(exchangeId: number, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetExchangeJobs`, {
        params: {exchangeId: exchangeId, listState: JSON.stringify(listState)}
      },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  importExchangeJobs(importExchangeJobsRequest: ImportExchangeJobsRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/ImportExchangeJobs`, importExchangeJobsRequest);
  }

  upsertExchange(exchangeListItem: UpsertExchangeRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/UpsertExchange`, exchangeListItem);
  }

  validateExchangeJobs(validateExchangeJobsRequest: ValidateExchangeJobsRequest): Observable<ExchangeJobsValidationResultModel> {
    const url = `${this.endpoint}/ValidateExchangeJobs?exchangeId=${validateExchangeJobsRequest.ExchangeId}`;
    const formData: FormData = new FormData();
    formData.append('file', validateExchangeJobsRequest.File);
    return this.payfactorsApiService.post(url, formData);
  }
}
