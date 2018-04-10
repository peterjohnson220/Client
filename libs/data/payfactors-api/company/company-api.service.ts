import { Injectable } from '@angular/core';
import { PayfactorsApiService } from '../payfactors-api.service';
import { CompanySettingDto } from '../../../models/company';

@Injectable()
export class CompanyApiService {
  private endpoint = 'Company';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getCompanySettings() {
    return this.payfactorsApiService.get<CompanySettingDto[]>(`${this.endpoint}.GetCompanySettings`);
  }
}
