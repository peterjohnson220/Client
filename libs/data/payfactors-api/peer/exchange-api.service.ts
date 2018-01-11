import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';

import {
  ExchangeListItem, Exchange, ExchangeCompany, UpsertExchangeRequest,
  AddExchangeCompaniesRequest, ExchangeJob, AddExchangeJobsRequest
} from '../../../models/peer';
import { PayfactorsApiService } from '../payfactors-api.service';
import { ValidateExchangeJobsRequest, ImportExchangeJobsRequest, ExchangeJobsValidationResultModel } from '../../../models/peer';

@Injectable()
export class ExchangeApiService {
  private endpoint = 'Exchange';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  upsertExchange(exchangeListItem: UpsertExchangeRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/UpsertExchange`, exchangeListItem);
  }

  getAllExchanges(): Observable<ExchangeListItem[]> {
    return this.payfactorsApiService.get<ExchangeListItem[]>(`${this.endpoint}/GetAllExchanges`);
  }

  getCompanies(exchangeId: number): Observable<ExchangeCompany[]> {
    return this.payfactorsApiService.get<ExchangeCompany[]>(`${this.endpoint}/GetCompanies`, { params: { exchangeId: exchangeId } });
  }

  getAvailableCompanies(exchangeId: number, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetAvailableCompanies`, {
        params: {exchangeId: exchangeId, listState: JSON.stringify(listState)}
      },
      (result: any): GridDataResult => ({ total: result.Count, data: JSON.parse(result.Data)})
    );
  }

  addCompanies(addExchangeCompaniesRequest: AddExchangeCompaniesRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/AddCompanies`, addExchangeCompaniesRequest);
  }

  getAvailableJobs(exchangeId: number, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetAvailableJobs`, {
        params: {exchangeId: exchangeId, listState: JSON.stringify(listState)}
      },
      (result: any): GridDataResult => ({ total: result.Count, data: JSON.parse(result.Data)})
    );
  }

  addJobs(addExchangeJobsRequest: AddExchangeJobsRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/AddJobs`, addExchangeJobsRequest);
  }

  getExchange(exchangeId: number): Observable<Exchange> {
    return this.payfactorsApiService.get<Exchange>(`${this.endpoint}/GetExchange`, { params: { exchangeId: exchangeId } });
  }

  validateExchangeJobs(validateExchangeJobsRequest: ValidateExchangeJobsRequest): Observable<ExchangeJobsValidationResultModel> {
    const url = `${this.endpoint}/ValidateExchangeJobs?exchangeId=${validateExchangeJobsRequest.ExchangeId}`;
    const formData: FormData = new FormData();
    formData.append('file', validateExchangeJobsRequest.File);
    return this.payfactorsApiService.post(url, formData);
  }

  importExchangeJobs(importExchangeJobsRequest: ImportExchangeJobsRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/ImportExchangeJobs`, importExchangeJobsRequest);
  }

  getExchangeJobs(exchangeId: number): Observable<ExchangeJob[]> {
    return this.payfactorsApiService.get<ExchangeJob[]>(`${this.endpoint}/GetExchangeJobs`, { params: { exchangeId: exchangeId } });
  }
}
