import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { MappingHelper } from '../../../core/helpers';
import {
  ExchangeJobSearch,
  ExchangeListItem,
  Exchange,
  UpsertExchangeRequest,
  AddExchangeCompaniesRequest,
  ValidateExchangeJobsRequest,
  ImportExchangeJobsRequest,
  CompanyOption,
  ExchangeJobsValidationResultModel,
  AddExchangeJobsRequest,
  ExchangeJobRequest,
  ExchangeInvitation,
  GenericKeyValue,
  AutoAssociateExchangeJobsRequest,
  ExchangeJobRequestAction,
  ExchangeRequestActionEnum,
  CompanyExchangeInvitationAction,
  ExchangeSearchFilterAggregate
} from '../../../models';
import { PayfactorsApiService } from '../payfactors-api.service';
import {ExchangeManagementDetails} from '../../../../apps/admin/app/_peer/models';

@Injectable({
  providedIn: 'root',
})
export class ExchangeApiService {
  private endpoint = 'Exchange';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  addCompanies(addExchangeCompaniesRequest: AddExchangeCompaniesRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/AddCompanies`, addExchangeCompaniesRequest);
  }

  getAllExchanges(searchQuery: string): Observable<ExchangeListItem[]> {
    return this.payfactorsApiService.get<ExchangeListItem[]>(`${this.endpoint}/GetAllExchanges`,
      {
        params: { searchQuery }
      });
  }


  getAvailableCompanies(exchangeId: number, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetAvailableCompanies`, {
      params: { exchangeId: exchangeId, listState: JSON.stringify(listState) }
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

  getActiveExchangeId(): Observable<number> {
    return this.payfactorsApiService.get<number>(`${this.endpoint}/GetActiveExchangeId`);
  }

  autoAssociateExchangeJobs(autoAssociateExchangeJobsRequest: AutoAssociateExchangeJobsRequest): Observable<number> {
    return this.payfactorsApiService
      .post(`${this.endpoint}/AutoAssociateExchangeJobs`, autoAssociateExchangeJobsRequest, (successCount: number) => successCount);
  }

  getCompanies(exchangeId: number, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetCompanies`, {
      params: { exchangeId: exchangeId, listState: JSON.stringify(listState) }
    },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  getTopPeerParticipants(searchTerm: string): Observable<CompanyOption[]> {
    return this.payfactorsApiService.get<CompanyOption[]>(`${this.endpoint}/GetTopPeerParticipants`, {
      params: { query: searchTerm }
    });
  }

  getAvailableJobs(exchangeId: number, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetAvailableJobs`, {
      params: { exchangeId: exchangeId, listState: JSON.stringify(listState) }
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

  getExchangeManagementDetails(exchangeId: number): Observable<ExchangeManagementDetails> {
    return this.payfactorsApiService.get<ExchangeManagementDetails>(`${this.endpoint}/GetExchangeManagementDetails`,
      { params: { exchangeId: exchangeId } }
      );
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

  exchangeJobRequestAction(jobRequest: ExchangeJobRequest, reason: string,
                           peopleToNotify: string, action: ExchangeRequestActionEnum): Observable<any> {
    const requestAction: ExchangeJobRequestAction = {
      JobRequest: jobRequest, Reason: reason,
      PeopleToNotify: peopleToNotify, Action: action.toString()
    };
    return this.payfactorsApiService.post(`${this.endpoint}/ExchangeJobRequestAction`, requestAction);
  }

  companyExchangeInvitationAction(companyInvitation: ExchangeInvitation, reason: string,
                                  peopleToNotify: string, action: ExchangeRequestActionEnum): Observable<any> {
    const requestAction: CompanyExchangeInvitationAction = {
      CompanyInvitation: companyInvitation, Reason: reason,
      PeopleToNotify: peopleToNotify, Action: action.toString()
    };
    return this.payfactorsApiService.post(`${this.endpoint}/CompanyExchangeInvitationAction`, requestAction);
  }

  getExchangeJobs(exchangeId: number, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetExchangeJobs`, {
      params: { exchangeId: exchangeId, listState: JSON.stringify(listState) }
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

  getExchangeJobSearch(exchangeId: number, jobTitleSearch: string, jobDescriptionSearch: string) {
    return this.payfactorsApiService.get<ExchangeJobSearch[]>(`${this.endpoint}/GetExchangeJobSearch`,
      { params: { exchangeId: exchangeId, jobTitleSearch: jobTitleSearch, jobDescriptionSearch: jobDescriptionSearch } });
  }

  getExchangeFilters(exchangeId: number, searchString: string): Observable<GridDataResult>  {
    return this.payfactorsApiService.get<GridDataResult>(`${this.endpoint}/GetExchangeFilters`, {
      params: { exchangeId: exchangeId, searchString: searchString }
    },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  putFilter(filter: ExchangeSearchFilterAggregate): Observable<ExchangeSearchFilterAggregate> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/PutFilter`, filter);
  }

  putFilters(filters: ExchangeSearchFilterAggregate[]): Observable<any> {
    return this.payfactorsApiService.put<any>(`${this.endpoint}/PutFilters`, filters);
  }

  updateExchangeStatus(payload: any): Observable<Exchange> {
    return this.payfactorsApiService.post<Exchange>(`${this.endpoint}/UpdateExchangeStatus`, payload);
  }

  exportExchangeJobs(exchangeId: number): Observable<any> {
    return this.payfactorsApiService.downloadFile(`${this.endpoint}/ExportExchangeJobs`,  exchangeId);
  }
}
