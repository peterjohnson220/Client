import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { MappingHelper } from '../../../core/helpers';
import { ExchangeListItem, ExchangeCompany, UpsertExchangeJobMapRequest,
        CompanyJobToMapTo, GetChartRequest, GetDetailChartRequest, ChartItem,
        RequestExchangeRequest, AddDataCutRequest, UpdateDataCutRequest } from '../../../models';
import { PayfactorsApiService } from '../payfactors-api.service';
import { ExchangeRequestCandidatesRequest } from '../../../models/peer';

@Injectable()
export class ExchangeCompanyApiService {
  private endpoint = 'ExchangeCompany';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getExchanges(): Observable<ExchangeListItem[]> {
    return this.payfactorsApiService.get<ExchangeListItem[]>(`${this.endpoint}/GetExchanges`);
  }

  getTopCandidates<T>(exchangeRequestCandidatesRequest: ExchangeRequestCandidatesRequest): Observable<T[]> {
    return this.payfactorsApiService.get<T[]>(`${this.endpoint}/GetTopCandidates`,
      { params: {exchangeRequestCandidatesRequest: JSON.stringify(exchangeRequestCandidatesRequest)} }
    );
  }

  getExchangeJobsWithMappings(exchangeId: number, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(
      `${this.endpoint}/GetExchangeJobsWithMappings`,
      { params: { exchangeId, listState: JSON.stringify(listState) } },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  getExchangeJobComparisonList(exchangeId: number, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(
      `${this.endpoint}/GetExchangeCompanyJobComparisonList`,
      { params: { exchangeId, listState: JSON.stringify(listState) } },
      MappingHelper.mapListAreaResultToGridDataResult
    );
  }

  getTopCompanyJobsToMapTo(exchangeId: number, query: string): Observable<CompanyJobToMapTo[]> {
    return this.payfactorsApiService.get<CompanyJobToMapTo[]>(`${this.endpoint}/GetTopCompanyJobsToMapTo`,
      { params: { exchangeId, query } }
    );
  }

  upsertExchangeJobMap(upsertExchangeJobMapRequest: UpsertExchangeJobMapRequest) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/UpsertExchangeJobMap`,
      upsertExchangeJobMapRequest
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

  addDataCut(addDataCutRequest: AddDataCutRequest): Observable<number> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/AddDataCut`, addDataCutRequest);
  }

  updateDataCut(updateDataCutRequest: UpdateDataCutRequest): Observable<number> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/UpdateDataCut`, updateDataCutRequest);
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
}
