import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { MappingHelper } from '../../../core/helpers';
import {
  ExchangeListItem, Exchange, UpsertExchangeRequest, AddExchangeCompaniesRequest,
  ValidateExchangeJobsRequest, ImportExchangeJobsRequest, CompanyOption,
  ExchangeJobsValidationResultModel, AddExchangeJobsRequest, ExchangeJobRequest, ExchangeInvitation,
  GenericKeyValue, AutoAssociateExchangeJobsRequest, ExchangeJobRequestAction, ExchangeRequestActionEnum
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

  getPeerParticipantsDictionary(): Observable<GenericKeyValue<number, string>[]> {
    return this.payfactorsApiService.get<GenericKeyValue<number, string>[]>(`${this.endpoint}/GetPeerParticipantsDictionary`);
  }

  getExchangeDictionaryForCompany(companyId: number): Observable<GenericKeyValue<number, string>[]> {
    return this.payfactorsApiService.get<GenericKeyValue<number, string>[]>(`${this.endpoint}/GetExchangeDictionaryForCompany`,
      {
        params: { companyId: companyId }
    });
  }

  autoAssociateExchangeJobs(autoAssociateExchangeJobsRequest: AutoAssociateExchangeJobsRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/AutoAssociateExchangeJobs`, autoAssociateExchangeJobsRequest);
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

  exchangeJobRequestAction(jobRequest: ExchangeJobRequest, reason: string, action: ExchangeRequestActionEnum): Observable<any> {
    const requestAction: ExchangeJobRequestAction = {JobRequest: jobRequest, Reason: reason, Action: action.toString()};
    return this.payfactorsApiService.post(`${this.endpoint}/ExchangeJobRequestAction`, requestAction);
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
