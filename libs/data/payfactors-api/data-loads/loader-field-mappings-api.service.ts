import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';
import { LoaderFieldSet, FieldMappingsDTO } from 'libs/models/data-loads/index';

@Injectable()
export class LoaderFieldMappingsApiService {
  private endpoint = 'LoaderFieldMappings';

  constructor(
    private payfactorsApiService: PayfactorsApiService
  ) {}

  getCustomJobFields(companyId: number) {
    return this.payfactorsApiService.get<any[]>(`${this.endpoint}/GetCustomJobFields`, {
      params: {companyId: companyId}
    });
  }

  getCustomEmployeeFields(companyId: number) {
    return this.payfactorsApiService.get<any[]>(`${this.endpoint}/GetCustomEmployeeFields`, {
      params: {companyId: companyId}
    });
  }

  getCompanyFieldMappings(companyId: number) {
    return this.payfactorsApiService.get<LoaderFieldSet[]>(`${this.endpoint}/GetCompanyFieldMappings`, {
      params: {companyId: companyId}
    });
  }

  saveFieldMappings(mappingsDto: FieldMappingsDTO) {
    return this.payfactorsApiService.post(`${this.endpoint}.SaveFieldMappings`, mappingsDto);
  }
}
