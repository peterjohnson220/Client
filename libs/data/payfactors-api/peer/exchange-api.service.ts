import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { MappingHelper } from '../../../core/helpers';
import {
  ExchangeListItem, Exchange, UpsertExchangeRequest, AddExchangeCompaniesRequest,
  ValidateExchangeJobsRequest, ImportExchangeJobsRequest, CompanyOption,
  ExchangeJobsValidationResultModel, AddExchangeJobsRequest, ExchangeJobRequest, ExchangeInvitation
} from '../../../models';
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

  getTopPeerParticipants(searchTerm: string): Observable<CompanyOption[]> {
    return this.payfactorsApiService.get<CompanyOption[]>(`${this.endpoint}/GetTopPeerParticipants`, {
      params: {query: searchTerm}
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

  getPendingExchangeAccessRequests(exchangeId: number): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetPendingExchangeAccessRequests`, {
        params: { exchangeId: exchangeId }
      },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  getPendingPayfactorsCompanyExchangeInvitations(exchangeId: number): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetPendingPayfactorsCompanyExchangeInvitations`, {
        params: { exchangeId: exchangeId }
      },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  getPendingNewCompanyExchangeInvitations(exchangeId: number): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetPendingNewCompanyExchangeInvitations`, {
        params: { exchangeId: exchangeId }
      },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  getPendingExchangeJobRequests(exchangeId: number): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetPendingExchangeJobRequests`, {
        params: { exchangeId: exchangeId }
      },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  approveExchangeJobRequest(jobRequest: ExchangeJobRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/ApproveExchangeJobRequest`, jobRequest);
  }

  denyExchangeJobRequest(jobRequest: ExchangeJobRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/DenyExchangeJobRequest`, jobRequest);
  }

  approveCompanyExchangeInvitaiton(companyInvitation: ExchangeInvitation): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/ApproveCompanyExchangeInvitation`, companyInvitation);
  }

  denyCompanyExchangeInvitation(companyInvitation: ExchangeInvitation): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/DenyCompanyExchangeInvitation`, companyInvitation);
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

  deleteExchangeCompany(payload: any): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/DeleteExchangeCompany`, payload);
  }

  deleteExchange(exchangeId: number): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/DeleteExchange`, exchangeId);
  }
}
