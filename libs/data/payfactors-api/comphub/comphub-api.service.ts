import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { QuickPriceResponse, QuickPriceRequest, TrendingJobGroupResponse } from '../../../models/payfactors-api/comphub';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class ComphubApiService {
  private endpoint = 'Comphub';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getTrendingJobs(): Observable<TrendingJobGroupResponse[]>  {
    return this.payfactorsApiService.get<TrendingJobGroupResponse[]>(`${this.endpoint}/GetTrendingJobs`);
  }

  getQuickPriceData(request: QuickPriceRequest): Observable<QuickPriceResponse>  {
    return this.payfactorsApiService.post<QuickPriceResponse>(`${this.endpoint}/GetQuickPriceData`, request);
  }
}
