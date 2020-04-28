import { Injectable } from '@angular/core';

import { PayfactorsApiService } from '../payfactors-api.service';
import { CreateProjectRequest, MatchedSurveyJob } from 'libs/models/payfactors-api';
import { BaseUrlLocation } from 'libs/models/payfactors-api/common/base-url-location.enum';

@Injectable()
export class JobsApiService {
  private endpoint = 'Jobs';

  constructor(private payfactorsApiService: PayfactorsApiService
  ) { }

  createProject(request: CreateProjectRequest) {
    return this.payfactorsApiService.post<any>(`${this.endpoint}/AddToProject`, request);
  }

  // TODO: I was able to successfully export from legacy page against stage/pfi utilities boxes
  // I have a feeling the null value for the headers param (which is the default value on downloadFile) may be a contributing factor
  // if nothing else, test this change and compare the network requests to see which headers/values are needed
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

  getPricingsToModify(pricingIds: number[]) {
    return this.payfactorsApiService.post<MatchedSurveyJob[]>(`${this.endpoint}/GetPricingsToModify`, pricingIds);
  }
}
