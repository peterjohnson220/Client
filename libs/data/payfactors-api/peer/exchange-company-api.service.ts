import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { MappingHelper } from '../../../core/helpers';
import { ExchangeListItem, ExchangeCompany, ExchangeJobMapping } from '../../../models/peer';
import { PayfactorsApiService } from '../payfactors-api.service';
import { CompanyJobToMapTo } from '../../../models/peer/company-job-to-map-to.model';



@Injectable()
export class ExchangeCompanyApiService {
  private endpoint = 'ExchangeCompany';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getExchanges(): Observable<ExchangeListItem[]> {
    return this.payfactorsApiService.get<ExchangeListItem[]>(`${this.endpoint}/GetExchanges`);
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

  mapExchangeJob(exchangeId: number, exchangeJobId: number, companyJobId: number) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/MapExchangeJob`,
      { exchangeId, exchangeJobId, companyJobId }
    );
  }
}
