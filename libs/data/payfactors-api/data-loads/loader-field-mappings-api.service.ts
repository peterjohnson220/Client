import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';

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

  saveFieldMappings(mappings: any, ) {
    return this.payfactorsApiService.post(`${this.endpoint}.SaveFieldMappings`, {
      mappings: mappings.mappings,
      companyId: mappings.companyId,
      delimiter: mappings.delimiter,
      dateFormat: mappings.dateFormat
  });
  }
}
