import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { SaveCompanyJobsJobDescriptionTemplateIdRequest } from '../../../models/payfactors-api/job-description-template/request';
import { TemplateListItemResponse } from '../../../models/payfactors-api/job-description-template/response';

@Injectable()
export class JobDescriptionTemplateApiService {
  private endpoint = 'JobDescriptionTemplate';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  get(): Observable<TemplateListItemResponse[]> {
    return this.payfactorsApiService.get<TemplateListItemResponse[]>(`${this.endpoint}`);
  }

  getPublished(): Observable<TemplateListItemResponse[]> {
    return this.payfactorsApiService.get<TemplateListItemResponse[]>(`${this.endpoint}`, {params: { publishedOnly: true }});
  }

  saveCompanyJobsJobDescriptionTemplateId(request: SaveCompanyJobsJobDescriptionTemplateIdRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}(${request.TemplateId})/Default.SaveCompanyJobsJobDescriptionTemplateId`,
      request);
  }
}
