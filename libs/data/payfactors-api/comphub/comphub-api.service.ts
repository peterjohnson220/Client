import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  QuickPriceResponse, QuickPriceRequest, TrendingJobGroupResponse,
  JobPricingLimitInfoResponse, JobSalaryTrendRequest, JobSalaryTrendResponse,
  PayMarketDataResponse, SharePricingSummaryRequest, CreateQuickPriceProjectRequest, CountryDataSetResponse,
  AddCompletedPricingHistoryRequest
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

  getJobPricingLimitInfo(): Observable<JobPricingLimitInfoResponse>  {
    return this.payfactorsApiService.get<JobPricingLimitInfoResponse>(`${this.endpoint}/GetJobPricingLimitInfo`);
  }

  getJobSalaryTrendData(request: JobSalaryTrendRequest): Observable<JobSalaryTrendResponse>  {
    return this.payfactorsApiService.post<JobSalaryTrendResponse>(`${this.endpoint}/GetJobSalaryTrendData`, request);
  }

  getPaymarketData(countryCode: string): Observable<PayMarketDataResponse>  {
    return this.payfactorsApiService.get<PayMarketDataResponse>(`${this.endpoint}/GetAccessiblePayMarkets`,
      { params: { countryCode: countryCode } });
  }

  getActiveCountryDataSet(): Observable<CountryDataSetResponse> {
    return this.payfactorsApiService.get<CountryDataSetResponse>(`${this.endpoint}/GetActiveCountryDataSet`);
  }

  sharePricingSummary(request: SharePricingSummaryRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/SharePricingSummary`, request);
  }

  createQuickPriceProject(request: CreateQuickPriceProjectRequest): Observable<number> {
    return this.payfactorsApiService.post(`${this.endpoint}/CreateQuickPriceProject`, request);
  }

  addCompletedPricingHistory(request: AddCompletedPricingHistoryRequest): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/AddCompletedPricingHistory`, request);
  }
}
