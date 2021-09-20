import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  QuickPriceListResponse,
  QuickPriceRequest,
  TrendingJobGroupResponse,
  JobPricingLimitInfoResponse,
  JobSalaryTrendRequest,
  JobSalaryTrendResponse,
  PayMarketDataResponse,
  SharePricingSummaryRequest,
  CreateQuickPriceProjectRequest,
  CountryDataSetResponse,
  AddCompletedPricingHistoryRequest,
  JobPricedHistorySummaryRequest,
  JobPricedHistorySummaryResponse,
  QuickPriceJobDataRequest,
  QuickPriceJobDataResponse
} from 'libs/models/payfactors-api/comphub';
import { QuickPriceExchangeDataSearchRequest } from 'libs/models/payfactors-api/peer/exchange-data-search/request';
import { PayfactorsApiService } from 'libs/data/payfactors-api/payfactors-api.service';
import { ExchangeDataSet, PeerQuickPriceData } from 'libs/models/comphub';

@Injectable({
  providedIn: 'root',
})
export class ComphubApiService {
  private endpoint = 'Comphub';

  constructor(private payfactorsApiService: PayfactorsApiService) { }

  getTrendingJobs(countryCode: string): Observable<TrendingJobGroupResponse[]>  {
    return this.payfactorsApiService.get<TrendingJobGroupResponse[]>(`${this.endpoint}/GetTrendingJobs`,
      { params: { countryCode: countryCode } });
  }

  getTrendingExchangeJobs(exchangeId: number): Observable<TrendingJobGroupResponse[]>  {
    return this.payfactorsApiService.get<TrendingJobGroupResponse[]>(`${this.endpoint}/GetTrendingExchangeJobs`,
      { params: { exchangeId: exchangeId } });
  }

  getQuickPriceData(request: QuickPriceRequest): Observable<QuickPriceListResponse>  {
    return this.payfactorsApiService.post<QuickPriceListResponse>(`${this.endpoint}/GetQuickPriceData`, request);
  }

  getQuickPriceJobData(request: QuickPriceJobDataRequest): Observable<QuickPriceJobDataResponse>  {
    return this.payfactorsApiService.post<QuickPriceJobDataResponse>(`${this.endpoint}/GetQuickPriceJobData`, request);
  }

  getPeerQuickPriceData(context: QuickPriceExchangeDataSearchRequest): Observable<PeerQuickPriceData> {
    return this.payfactorsApiService.post<PeerQuickPriceData>(`${this.endpoint}/GetPeerQuickPriceData`, context);
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

  getCountryDataSets(): Observable<CountryDataSetResponse[]> {
    return this.payfactorsApiService.get<CountryDataSetResponse[]>(`${this.endpoint}/GetCountryDataSets`);
  }

  getExchangeDataSets(): Observable<ExchangeDataSet[]> {
    return this.payfactorsApiService.get<ExchangeDataSet[]>(`${this.endpoint}/GetExchangeDataSets`);
  }

  getUnrestrictedExchangeDataSets(): Observable<ExchangeDataSet[]> {
    return this.payfactorsApiService.get<ExchangeDataSet[]>(`${this.endpoint}/GetUnrestrictedExchangeDataSets`);
  }

  persistActiveCountryDataSet(countryCode: string): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/PersistActiveCountryDataSet`, { countryCode: countryCode});
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

  getJobPricedHistorySummary(request: JobPricedHistorySummaryRequest): Observable<JobPricedHistorySummaryResponse> {
    return this.payfactorsApiService.post(`${this.endpoint}/GetJobPricedHistorySummary`, request);
  }
}
