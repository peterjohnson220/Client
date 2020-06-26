import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State } from '@progress/kendo-data-query';

import { MappingHelper } from '../../../core/helpers';
import {
  ExchangeListItem, UpsertExchangeJobMapRequest,
  GetChartRequest, GetDetailChartRequest, ChartItem,
  RequestExchangeRequest, ExchangeRequestCandidatesRequest,
  SaveExchangeJobAssociationRequestModel, GetExchangeCompanyJobsAllEntityIdsRequest, AggregateGridDataResult, GenericKeyValue
} from '../../../models';
import { ExchangeJob } from 'libs/features/peer/job-association/models/exchange-job.model';
import { GenericMenuItem } from 'libs/models/common';

import { ExchangeJobsSearchParams } from 'apps/peer/app/_manage/models/exchange-jobs-search-params.model';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class ExchangeCompanyApiService {
  private endpoint = 'ExchangeCompany';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getExchanges(): Observable<ExchangeListItem[]> {
    return this.payfactorsApiService.get<ExchangeListItem[]>(`${this.endpoint}/GetExchanges`);
  }

  getTopCandidates<T>(exchangeRequestCandidatesRequest: ExchangeRequestCandidatesRequest): Observable<T[]> {
    return this.payfactorsApiService.get<T[]>(`${this.endpoint}/GetTopCandidates`,
      { params: { exchangeRequestCandidatesRequest: JSON.stringify(exchangeRequestCandidatesRequest) } }
    );
  }

  getActiveCompanyJobs(listState: any, companyJobIds: number[], searchTerm: string): Observable<GridDataResult> {
    return this.payfactorsApiService.post<GridDataResult>(
      `${this.endpoint}/GetActiveCompanyJobs`, {
        ListState: listState,
        CompanyJobIds: companyJobIds,
        SearchTerm: searchTerm
      },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  GetActiveCompanyJobsWithMatchedExchangeJob(listState: any, companyJobIds: number[],
                                             searchTerm: string, exchangeId: number): Observable<GridDataResult> {
    return this.payfactorsApiService.post<GridDataResult>(
      `${this.endpoint}/GetActiveCompanyJobsWithMatchedExchangeJob`, {
        ListState: listState,
        SearchTerm: searchTerm,
        ExchangeId: exchangeId
      },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  getExchangeJobsWithMappings(exchangeId: number, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(
      `${this.endpoint}/GetExchangeJobsWithMappings`,
      { params: { exchangeId, listState: JSON.stringify(listState) } },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  getExchangeJobs(listState: State, jobTitleSearchTerm: string, jobFamilies: string[], exchangeNames: string[]):
    Observable<GridDataResult> {
    return this.payfactorsApiService.post<AggregateGridDataResult>(
      `${this.endpoint}/GetExchangeJobs`,
      {
        JobTitleSearchTerm: jobTitleSearchTerm,
        ListState: listState,
        JobFamilies: jobFamilies,
        ExchangeNames: exchangeNames
      },
      MappingHelper.mapListAreaResultToAggregateGridDataResult
    );
  }

  getAssociatedExchangeJobs(companyJobId: number): Observable<ExchangeJob[]> {
    const params = { params: { companyJobId } };
    return this.payfactorsApiService.get<ExchangeJob[]>(`${this.endpoint}/GetAssociatedExchangeJobs`, params);
  }

  GetAssociableExchangeJobs(params: ExchangeJobsSearchParams) {
    return this.payfactorsApiService.post<ExchangeJob[]>(`${this.endpoint}/GetAssociableExchangeJobs`, params);
  }

  getExchangeJobComparisonList(exchangeId: number, listState: any, countryCode: string): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(
      `${this.endpoint}/GetExchangeCompanyJobComparisonList`,
      { params: { exchangeId, countryCode, listState: JSON.stringify(listState) } },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  getExchangeCompanyJobs(exchangeId: number, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(
      `${this.endpoint}/GetExchangeCompanyJobs`,
      { params: { exchangeId, listState: JSON.stringify(listState) } },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  getExchangeCompanyJobsAllEntities(request: GetExchangeCompanyJobsAllEntityIdsRequest): Observable<number[]> {
    return this.payfactorsApiService.post<number[]>(
      `${this.endpoint}/GetExchangeCompanyJobsAllEntities`,
      request
    );
  }

  upsertExchangeJobMap(upsertExchangeJobMapRequest: UpsertExchangeJobMapRequest) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/UpsertExchangeJobMap`,
      upsertExchangeJobMapRequest
    );
  }

  saveJobAssociations(request: SaveExchangeJobAssociationRequestModel) {
    return this.payfactorsApiService.put<SaveExchangeJobAssociationRequestModel>(`${this.endpoint}/SaveJobAssociations`,
      request
    );
  }

  getChart(getChartRequest: GetChartRequest): Observable<ChartItem[]> {
    return this.payfactorsApiService.get<ChartItem[]>(`${this.endpoint}/GetChart`,
      { params: { getChartRequest: JSON.stringify(getChartRequest) } });
  }

  getDetailChart(getDetailChartRequest: GetDetailChartRequest): Observable<ChartItem[]> {
    return this.payfactorsApiService.get<ChartItem[]>(`${this.endpoint}/GetDetailChart`,
      { params: { getDetailChartRequest: JSON.stringify(getDetailChartRequest) } });
  }

  createExchangeRequest(payload: RequestExchangeRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/CreateExchangeRequest`, payload);
  }

  validateNewCompanyName(exchangeId: number, companyName: string): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/IsValidCompanyName`,
      { params: { exchangeId: exchangeId, companyName: companyName } }
    );
  }

  getCompanyIndustries(): Observable<string[]> {
    return this.payfactorsApiService.get<string[]>(`${this.endpoint}/GetCompanyIndustries`);
  }

  validateNewJobTitle(exchangeId: number, jobTitle: string): Observable<any> {
    return this.payfactorsApiService.get<any>(`${this.endpoint}/IsValidJobTitle`,
      { params: { exchangeId: exchangeId, jobTitle: jobTitle } }
    );
  }

  getPayfactorsJobFamilies(): Observable<string[]> {
    return this.payfactorsApiService.get<string[]>(`${this.endpoint}/GetPayfactorsJobFamilies`);
  }

  deleteExchangeJobMapping(exchangeJobToCompanyJobId: number): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/DeleteExchangeJobMapping`,
      exchangeJobToCompanyJobId
    );
  }

  deleteExchangeJobMappingByIds(request: UpsertExchangeJobMapRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/DeleteExchangeJobMappingByIds`, request);
  }

  approvePendingExchangeJobMapping(request: UpsertExchangeJobMapRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/ApprovePendingExchangeJobMapping`, request);
  }

  getExchangeJobOrgs(exchangeJobId: number, selectedMarket = 'USA'): Observable<ChartItem[]> {
    return this.payfactorsApiService.get<ChartItem[]>(`${this.endpoint}/GetExchangeJobOrgs`,
      { params: { exchangeJobId, countryCode: selectedMarket } }
    );
  }

  requestPeerAccess(): Observable<boolean> {
    return this.payfactorsApiService.post(`${this.endpoint}/RequestPeerAccess`);
  }

  getJobFamilies(): Observable<GenericMenuItem[]> {
    return this.payfactorsApiService.get<GenericMenuItem[]>(`${this.endpoint}/GetExchangeJobFamilies`, {}, this.mapJobFamiliesToItems);
  }

  downloadAssociations(entityId: number, entityType: string): Observable<any> {
    return this.payfactorsApiService.downloadFile(`${this.endpoint}/DownloadAssociationsToExcel?entityId=${entityId}&entityType=${entityType}`);
  }

  private mapJobFamiliesToItems(jobFamilies: string[]) {
    return jobFamilies.map(f => ({ DisplayName: f, IsSelected: false, Value: f } as GenericMenuItem));
  }
}
