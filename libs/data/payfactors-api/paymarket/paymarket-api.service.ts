import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AddPayMarketRequest, UpdatePayMarketRequest } from 'libs/models/payfactors-api';
import { SurveyAndScope } from 'libs/models/survey';

import { PayfactorsApiService } from '../payfactors-api.service';
import { PayMarket, PayMarketAssociationsSummary, PayMarketWithMdScope } from '../../../models/paymarket';
import { GenericKeyValue } from '../../../models/common';

@Injectable({
  providedIn: 'root',
})
export class PayMarketApiService {
  private endpoint = 'PayMarket';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  get(companyPayMarketId: number) {
    return this.payfactorsApiService
      .get<any>(`${this.endpoint}(${companyPayMarketId})`);
  }

  getAll(fields?: string[]): Observable<PayMarket[]> {
    const fieldOptions = fields && fields.length ? {
      $select: fields.join()
    } : {};
    return this.payfactorsApiService
      .get<PayMarket[]>(`${this.endpoint}`, { params: fieldOptions });
  }

  getAllByCountryCode(countryCode: string): Observable<PayMarket[]> {
    return this.payfactorsApiService
      .get<PayMarket[]>(`${this.endpoint}`, { params: { $filter: `CountryCode eq '${countryCode}'` } });
  }

  getExchangeScopeSelections(companyPayMarketId: number): Observable<any> {
    return this.payfactorsApiService.get<GenericKeyValue<number, string>[]>(
      `${this.endpoint}/GetExchangeScopeSelections`,
      { params: { companyPayMarketId: companyPayMarketId } }
    );
  }

  insert(request: AddPayMarketRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/Default.Insert`, request);
  }

  update(companyPayMarketId: number, request: UpdatePayMarketRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}(${companyPayMarketId})/Default.Update`, request);
  }

  deletePayMarket(companyPayMarketId: number): Observable<number> {
    return this.payfactorsApiService.delete(`${this.endpoint}(${companyPayMarketId})/`);
  }

  setDefaultPayMarket(companyPayMarketId: number): Observable<any> {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.SetDefaultPayMarket`, { CompanyPayMarketId: companyPayMarketId });
  }

  getAvailablePayMarketsToCreateLink(companyPayMarketId: number): Observable<PayMarket[]> {
    return this.payfactorsApiService.get<PayMarket[]>(`${this.endpoint}/GetAvailablePayMarketsToCreateLink`,
      { params: { companyPayMarketId }});
  }

  getDefaultUserPayMarket(): Observable<PayMarketWithMdScope> {
    return this.payfactorsApiService.get<PayMarketWithMdScope>(`${this.endpoint}/GetDefaultUserPayMarket`);
  }

  getPayMarketWithMdScope(companyPayMarketId: number): Observable<PayMarketWithMdScope> {
    return this.payfactorsApiService.get<PayMarketWithMdScope>(`${this.endpoint}/GetPayMarketWithMdScope`,
      { params: { companyPayMarketId }});
  }

  getDefaultScopeAndSurveyInfo(companyPayMarketId: number): Observable<SurveyAndScope[]> {
    return this.payfactorsApiService.get<SurveyAndScope[]>(`${this.endpoint}/GetDefaultScopeAndSurveyInfo`,
      { params: { companyPayMarketId } });
  }

  getPayMarketAssociationsSummary(companyPayMarketId: number): Observable<PayMarketAssociationsSummary> {
    return this.payfactorsApiService.get<PayMarketAssociationsSummary>(`${this.endpoint}/GetPaymarketAssociations`,
      { params: { companyPayMarketId } });
  }

  getParentPayMarkets(countryCodes: string[]): Observable<GenericKeyValue<number, string>[]> {
    const payload = {countryCodes: countryCodes};
    return this.payfactorsApiService.post<GenericKeyValue<number, string>[]>(`${this.endpoint}.GetParentPayMarkets`, payload);
  }
}
