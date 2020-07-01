import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CreateProjectRequest, MatchedSurveyJob } from 'libs/models/payfactors-api';
import { BaseUrlLocation } from 'libs/models/payfactors-api/common/base-url-location.enum';

@Injectable()
export class JobsApiService {
  private endpoint = 'Jobs';
  private frontEndExportEndpoint = 'Pricing';

  constructor(private payfactorsApiService: PayfactorsApiService
  ) { }

  createProject(request: CreateProjectRequest) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/AddToProject`, request);
  }

  exportPricings(request: any) {
    return this.payfactorsApiService.downloadFile(`${this.frontEndExportEndpoint}/${request.Endpoint}`, {
      CompanyJobIds: request.CompanyJobIds,
      PricingIds: request.PricingIds,
      FileExtension: request.FileExtension,
      Name: request.Name
    }, null, false, BaseUrlLocation.FrontEnd, true, true);
  }

  loadCustomExports() {
    return this.payfactorsApiService.get(`CustomExport.GetCustomExportData?pageName=Jobs`);
  }

  getPricingsToModify(pricingIds: number[]) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/GetPricingsToModify`, pricingIds);
  }

  getPricingCuts(request: any) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/GetPricingCuts`, request);
  }
}
