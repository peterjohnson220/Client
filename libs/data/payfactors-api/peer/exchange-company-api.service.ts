import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { MappingHelper } from '../../../core/helpers';
import { ExchangeListItem, ExchangeCompany, UpsertExchangeJobMapRequest,
        CompanyJobToMapTo, GetChartRequest, ChartItem,
        AvailableExchangeItem, RequestExchangeAccessRequest,
        AddDataCutRequest } from '../../../models';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class ExchangeCompanyApiService {
  private endpoint = 'ExchangeCompany';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getExchanges(): Observable<ExchangeListItem[]> {
    return this.payfactorsApiService.get<ExchangeListItem[]>(`${this.endpoint}/GetExchanges`);
  }

  getTopExchanges(query: string, companyFilterId?: number): Observable<AvailableExchangeItem[]> {
    return this.payfactorsApiService.get<AvailableExchangeItem[]>(`${this.endpoint}/GetTopExchanges`,
      { params: { query, companyFilterId } }
      );
  }

  getExchangeJobsWithMappings(exchangeId: number, query: string, listState: any): Observable<GridDataResult> {
    return this.payfactorsApiService.get<GridDataResult>(
      `${this.endpoint}/GetExchangeJobsWithMappings`,
      { params: { exchangeId, query, listState: JSON.stringify(listState) } },
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

  addDataCut(addDataCutRequest: AddDataCutRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/AddDataCut`, addDataCutRequest);
  }

  requestExchangeAccess(payload: RequestExchangeAccessRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/RequestExchangeAccess`, payload);
  }
}
