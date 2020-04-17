import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CreateProjectRequest } from 'libs/models/payfactors-api';
import { BaseUrlLocation } from 'libs/models/payfactors-api/common/base-url-location.enum';

@Injectable()
export class JobsApiService {
  private endpoint = 'Jobs';

  constructor(private payfactorsApiService: PayfactorsApiService
  ) { }

  createProject(request: CreateProjectRequest) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/AddToProject`, request);
  }

  exportPricings(request: any) {
    return this.payfactorsApiService.downloadFile(`${this.endpoint}/${request.Endpoint}`, {
      CompanyJobIds: request.CompanyJobIds,
      PricingIds: request.PricingIds,
      FileExtension: request.FileExtension,
      Name: request.Name
    }, null, false, BaseUrlLocation.Default, true);
  }

  loadCustomExports() {
    return this.payfactorsApiService.get(`CustomExport.GetCustomExportData?pageName=Jobs`);
  }
}
