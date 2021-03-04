import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseExchangeDataSearchRequest, ExchangeJobDailyNatAvgOrg50thDetails } from 'libs/models/payfactors-api';
import { DataCutSummaryEntityTypes } from 'libs/constants';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class DataCutSummaryApiService {
  private endpoint = 'DataCutSummary';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getDataCutSummary(entityId: any, entityType: DataCutSummaryEntityTypes): Observable<any> {
    return this.payfactorsApiService.get(`${this.endpoint}/GetDataCutSummary?entityId=${entityId}&entityType=${entityType}`);
  }

  getDataCutSummaryForCustomScope(customScope: BaseExchangeDataSearchRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetDataCutSummary`, customScope);
  }

  getNationalAveragesForExchangeJobs(exchangeJobIds: number[]): Observable<ExchangeJobDailyNatAvgOrg50thDetails[]> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetNationalAveragesForExchangeJobs`, exchangeJobIds);
  }
}
