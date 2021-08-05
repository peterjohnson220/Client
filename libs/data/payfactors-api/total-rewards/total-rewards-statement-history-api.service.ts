import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { StatementHistorySearchRequest } from 'libs/models/payfactors-api/total-rewards/request/statement-history-search-request.model';
import { StatementHistoryListResponse } from 'libs/models/payfactors-api/total-rewards/response/statement-history-list-response.model';

import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable({
  providedIn: 'root',
})
export class TotalRewardsStatementHistoryApiService {
  private endpoint = 'TotalRewardsStatementHistory';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getStatementHistory(searchRequest: StatementHistorySearchRequest): Observable<StatementHistoryListResponse> {
    return this.payfactorsApiService.post<StatementHistoryListResponse>(`${this.endpoint}/GetStatementHistory`, searchRequest);
  }

  getStatementUrl(pdfId: string): Observable<string> {
    return this.payfactorsApiService.get<string>(`${this.endpoint}/GetStatementUrl?pdfId=${pdfId}`);
  }
}
