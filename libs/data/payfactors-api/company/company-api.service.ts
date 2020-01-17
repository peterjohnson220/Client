import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CompanyDto, LegacyCompanySettingDto, CompanyFormData } from '../../../models/company';
import {
  SystemUserGroupsResponse, CompanyIndustriesResponse, CompanyTilesResponse,
  CompanyDataSetsReponse, CompanyClientTypesReponse, ListCompositeFields, JobPricingLimitInfoResponse
} from '../../../models/payfactors-api';
import { Company, CompanyBaseInformation } from 'libs/models/company/company.model';

@Injectable()
export class CompanyApiService {
  private endpoint = 'Company';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  get(companyId: number): Observable<CompanyDto> {
    return this.payfactorsApiService.get<CompanyDto>(this.endpoint + `(${companyId})`);
  }

  insert(company: CompanyFormData, tileIds: number[], marketingTileIds: number[], countryCodes: string[]) {
    return this.payfactorsApiService.post(`${this.endpoint}/Default.Insert`,
      { Company: company, TileIds: tileIds, MarketingTileIds: marketingTileIds, DataSetCountryCodes: countryCodes }
    );
  }

  update(company: CompanyFormData, tileIds: number[], marketingTileIds: number[], countryCodes: string[]) {
    return this.payfactorsApiService.post(`${this.endpoint}(${company.CompanyId})/Default.Update`,
      { Company: company, TileIds: tileIds, MarketingTileIds: marketingTileIds, DataSetCountryCodes: countryCodes }
    );
  }

  getCompanySettings() {
    return this.payfactorsApiService.get<LegacyCompanySettingDto[]>(`${this.endpoint}.GetCompanySettings`);
  }

  getCompanies() {
    return this.payfactorsApiService.get<Company[]>(`${this.endpoint}/Default.GetCompanies`);
  }

  getCompanyBaseInformation(searchTerm?: string, take?: number) {
    if (searchTerm || take) {
      return this.payfactorsApiService.get<CompanyBaseInformation[]>(`${this.endpoint}/GetCompanyBaseInformation`, { params: { searchTerm, take } });
    }
    return this.payfactorsApiService.get<CompanyBaseInformation[]>(`${this.endpoint}/GetCompanyBaseInformation`);
  }

  getCompany() {
    return this.payfactorsApiService.get<CompanyDto>(`${this.endpoint}/Get`);
  }

  getListOfCompanies() {
    return this.payfactorsApiService.get(`${this.endpoint}/Default.GetCompanyList`);
  }

  setPasswordExpiration() {
    return this.payfactorsApiService.get(`${this.endpoint}/SetPasswordExpiration`);
  }

  getSystemUserGroups(): Observable<SystemUserGroupsResponse[]> {
    return this.payfactorsApiService.get<SystemUserGroupsResponse[]>(`${this.endpoint}/Default.GetSystemUserGroups`);
  }

  getCompanyIndustries(): Observable<CompanyIndustriesResponse[]> {
    return this.payfactorsApiService.get<CompanyIndustriesResponse[]>(`${this.endpoint}/Default.GetCompanyIndustries`);
  }

  getCompanyTiles(companyId: number): Observable<CompanyTilesResponse[]> {
    return this.payfactorsApiService.get<CompanyTilesResponse[]>(`${this.endpoint}(${companyId})/Default.GetCompanyTiles`);
  }

  getCompanyDataSets(companyId: number): Observable<CompanyDataSetsReponse[]> {
    return this.payfactorsApiService.get<CompanyDataSetsReponse[]>(`${this.endpoint}(${companyId})/Default.GetCompanyDataSets`);
  }

  getCompanyClientTypes(): Observable<CompanyClientTypesReponse[]> {
    return this.payfactorsApiService.get<CompanyClientTypesReponse[]>(`${this.endpoint}/Default.GetCompanyClientTypes`);
  }

  getCompositeFields(): Observable<ListCompositeFields[]> {
    return this.payfactorsApiService.get<ListCompositeFields[]>(`CompositeField`);
  }

  getJobPricingLimitInfoByCompanyId(companyId: number): Observable<JobPricingLimitInfoResponse>  {
    return this.payfactorsApiService.get<JobPricingLimitInfoResponse>(`${this.endpoint}/GetJobPricingLimitInfoByCompanyId`,
      { params: { companyId: companyId } });
  }
}
