import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  QuickPriceResponse, QuickPriceRequest, TrendingJobGroupResponse,
  JobPricingLimitInfoResponse, JobSalaryTrendRequest, JobSalaryTrendResponse,
  PayMarketDataResponse, SharePricingSummaryRequest, CreateQuickPriceProjectRequest, CountryDataSetResponse,
  AddCompletedPricingHistoryRequest
} from '../../../models/payfactors-api/comphub';
import { BaseExchangeDataSearchRequest } from '../../../models/payfactors-api/peer/exchange-data-search/request';
import { PayfactorsApiService } from '../payfactors-api.service';
import { ExchangeDataSet, PeerQuickPriceData } from '../../../../apps/comphub/app/_main/models';

@Injectable()
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

  getQuickPriceData(request: QuickPriceRequest): Observable<QuickPriceResponse>  {
    return this.payfactorsApiService.post<QuickPriceResponse>(`${this.endpoint}/GetQuickPriceData`, request);
  }

  getPeerQuickPriceData(context: BaseExchangeDataSearchRequest): Observable<PeerQuickPriceData> {
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
}
