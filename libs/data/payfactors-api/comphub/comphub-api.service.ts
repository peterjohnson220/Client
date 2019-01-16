import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { TrendingJobResponse } from '../../../models/payfactors-api/comphub';
import { PayfactorsApiService } from '../payfactors-api.service';

@Injectable()
export class ComphubApiService {
  private endpoint = 'Comphub';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getTrendingJobs(industry: string): Observable<TrendingJobResponse[]>  {
    return this.payfactorsApiService.get<TrendingJobResponse[]>(`${this.endpoint}/GetTrendingJobs`);
  }
}
