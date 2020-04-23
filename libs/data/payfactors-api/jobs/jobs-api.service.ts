import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CreateProjectRequest, MatchedSurveyJob } from 'libs/models/payfactors-api';

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
    });
  }

  loadCustomExports() {
    return this.payfactorsApiService.get(`CustomExport.GetCustomExportData?pageName=Jobs`);
  }

  getPricingsToModify(pricingIds: number[]) {
    return this.payfactorsApiService.post<MatchedSurveyJob[]>(`${this.endpoint}/GetPricingsToModify`, pricingIds);
  }
}
