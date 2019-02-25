import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  QuickPriceResponse, QuickPriceRequest, TrendingJobGroupResponse,
  JobPricingLimitInfoResponse, JobSalaryTrendRequest, JobSalaryTrendResponse
} from '../../../models/payfactors-api/comphub';
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

  incrementPricedJobCount(): Observable<JobPricingLimitInfoResponse>  {
    return this.payfactorsApiService.post<JobPricingLimitInfoResponse>(`${this.endpoint}/IncrementPricedJobCount`);
  }

  getJobSalaryTrendData(request: JobSalaryTrendRequest): Observable<JobSalaryTrendResponse>  {
    return this.payfactorsApiService.post<JobSalaryTrendResponse>(`${this.endpoint}/GetJobSalaryTrendData`, request);
  }
}
