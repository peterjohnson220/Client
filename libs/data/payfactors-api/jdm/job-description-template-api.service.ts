import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { PayfactorsApiService } from '../payfactors-api.service';
import { SaveCompanyJobsJobDescriptionTemplateIdRequest } from '../../../models/payfactors-api/job-description-template/request';
import { TemplateListItemResponse } from '../../../models/payfactors-api/job-description-template/response';
import {
  LoadTemplateListByCompanyIdRequest
} from 'apps/job-description-management/app/shared/models/requests/load-template-list-by-company-id.request.model';

@Injectable()
export class JobDescriptionTemplateApiService {
  private endpoint = 'JobDescriptionTemplate';

  constructor(private payfactorsApiService: PayfactorsApiService) {
  }

  get(): Observable<TemplateListItemResponse[]> {
    return this.payfactorsApiService.get<TemplateListItemResponse[]>(`${this.endpoint}`);
  }

  getPublished(): Observable<TemplateListItemResponse[]> {
    return this.payfactorsApiService.get<TemplateListItemResponse[]>(`${this.endpoint}`, {params: {publishedOnly: true}});
  }

  getByCompanyId(loadTemplateListByCompanyIdRequest: LoadTemplateListByCompanyIdRequest): Observable<TemplateListItemResponse[]> {
    return this.payfactorsApiService.get<TemplateListItemResponse[]>(this.endpoint + `/Default.GetByCompanyId`,
      {params: {...loadTemplateListByCompanyIdRequest}});
  }

  saveCompanyJobsJobDescriptionTemplateId(templateId: number, request: SaveCompanyJobsJobDescriptionTemplateIdRequest): Observable<any> {
    return this.payfactorsApiService.post<any>(`${this.endpoint}(${templateId})/Default.SaveCompanyJobsJobDescriptionTemplateId`,
      request);
  }
}
